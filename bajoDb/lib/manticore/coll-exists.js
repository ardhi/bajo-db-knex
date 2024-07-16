async function collExists (schema) {
  const { getInfo } = this.app.bajoDb
  const { instance } = getInfo(schema)
  const tables = await instance.client.raw(`show tables like '${schema.collName}'`)
  return tables[0].length > 0
}

export default collExists
