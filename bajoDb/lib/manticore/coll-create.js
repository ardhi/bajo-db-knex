const stype = {
  integer: 'int',
  smallint: 'int',
  text: 'text',
  string: 'string',
  float: 'float',
  double: 'float',
  boolean: 'bool',
  date: 'timestamp',
  datetime: 'timestamp',
  time: 'timestamp',
  timestamp: 'timestamp',
  object: 'text'
}

async function collCreate (schema) {
  const { importPkg } = this.bajo.helper
  const { findIndex } = await importPkg('lodash-es')
  const { getInfo } = this.bajoDb.helper
  const { instance } = await getInfo(schema)
  await instance.client.schema.createTable(schema.collName, table => {
    for (const idx of schema.indexes ?? []) {
      if (idx.indexType === 'FULLTEXT') {
        for (const f of idx.fields) {
          const i = findIndex(schema.properties, { name: f })
          if (i > -1) schema.properties[i].type = 'text'
        }
      }
    }
    for (const p of schema.properties) {
      if (p.name === 'id') continue
      table.specificType(p.name, stype[p.type])
    }
    if (schema.engine) table.engine(`'${schema.engine}'`)
  })
}

export default collCreate
