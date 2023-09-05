async function create (schema) {
  const { importPkg } = this.bajo.helper
  const { getInfo } = this.bajoDb.helper
  const { has, isPlainObject, isString, omit, merge, cloneDeep } = await importPkg('lodash-es')
  const { instance } = await getInfo(schema)
  await instance.client.schema.createTable(schema.repoName, table => {
    for (let p of schema.properties) {
      p = cloneDeep(p)
      if (p.type === 'object') p.type = 'text'
      const args = []
      for (const a of ['maxLength', 'precision', 'kind']) {
        if (has(p, a)) args.push(p[a])
        if (a === 'precision' && has(p, 'scale')) args.push(p.scale)
      }
      const col = table[p.type](p.name, ...args)
      if (p.primary) {
        if (p.primary === true) col.primary()
        else if (isPlainObject(p.primary) && p.primary.name) col.primary(merge({ constraintName: p.primary.name }, omit(p.primary, ['name'])))
      }
      if (p.index) {
        if (p.index === true) col.index()
        else if (isString(p.index)) col.index(p.index)
        else if (isPlainObject(p.index) && p.index.name) col.index(p.index.name, omit(p.index, ['name']))
      }
      if (p.unique) {
        if (p.unique === true) col.unique()
        else if (isPlainObject(p.unique) && p.unique.name) col.unique(merge({ indexName: p.unique.name }, omit(p.unique, ['name'])))
      }
      if (p.required) col.notNullable()
      // if (p.default) col.defaultTo(p.default)
      if (p.unsigned && ['integer', 'smallint', 'float', 'double'].indexOf(p.type)) col.unsigned()
      if (p.comment) col.comment(p.comment)
    }
  })
}

export default create
