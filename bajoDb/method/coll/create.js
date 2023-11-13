async function create (schema) {
  const { importPkg, currentLoc, importModule } = this.bajo.helper
  const { getInfo } = this.bajoDb.helper
  const { has, omit, cloneDeep } = await importPkg('lodash-es')
  const { instance, driver } = await getInfo(schema)
  const mod = await importModule(`${currentLoc(import.meta).dir}/../../lib/${driver.type}/coll-create.js`)
  if (mod) return await mod.call(this, schema)
  await instance.client.schema.createTable(schema.collName, table => {
    for (let p of schema.properties) {
      if (p.name === 'id' && driver.forceDefaultId) continue
      p = cloneDeep(p)
      if (p.specificType) {
        table.specificType(p.name, p.specificType)
        continue
      }
      if (p.type === 'object') p.type = 'text'
      const args = []
      for (const a of ['maxLength', 'precision', 'kind']) {
        if (has(p, a)) args.push(p[a])
        if (a === 'precision' && has(p, 'scale')) args.push(p.scale)
      }
      let col
      if (p.autoInc && ['smallint', 'integer'].includes(p.type)) col = table.increments(p.name)
      else if (p.specificType) table.specificType(p.name, p.specificType)
      else col = table[p.type](p.name, ...args)
      if (p.index) {
        const opts = omit(p.index, ['name'])
        if (p.index.type === 'primary') {
          if (p.index.name) opts.constraintName = p.index.name
          col.primary(opts)
        } else if (p.index.type === 'unique') {
          if (p.index.name) opts.indexName = p.index.name
          col.unique(opts)
        } else {
          col.index(p.index.name, opts)
        }
      }
      if (p.required) col.notNullable()
      // if (p.default) col.defaultTo(p.default)
      if (p.unsigned && ['integer', 'smallint', 'float', 'double'].indexOf(p.type)) col.unsigned()
      if (p.comment) col.comment(p.comment)
    }
    for (const idx of schema.indexes ?? []) {
      const opts = omit(idx, ['name', 'unique', 'fields'])
      if (idx.name) opts.indexName = idx.name
      if (idx.unique) table.unique(idx.fields, opts)
      else table.index(idx.fields, idx.name, opts)
    }
    if (driver.dialect === 'mysql' && schema.engine) table.engine(schema.engine)
  })
}

export default create
