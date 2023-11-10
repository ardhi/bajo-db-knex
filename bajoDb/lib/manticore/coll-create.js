const stype = {
  integer: 'int',
  smallint: 'int',
  text: 'text',
  string: 'string',
  float: 'float',
  double: 'float',
  boolean: 'bool',
  date: 'date',
  datetime: 'datetime',
  time: 'time',
  timestamp: 'timestamp',
  object: 'text'
}

async function collCreate (schema) {
  const { getInfo } = this.bajoDb.helper
  const { instance } = await getInfo(schema)
  await instance.client.schema.createTable(schema.collName, table => {
    for (const p of schema.properties) {
      if (p.name === 'id') continue
      table.specificType(p.name, stype[p.type])
    }
    if (schema.engine) table.engine(`'${schema.engine}'`)
  })
}

export default collCreate
