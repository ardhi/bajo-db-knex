async function collExists (schema) {
  const { getInfo } = this.bajoDb.helper
  const { instance } = await getInfo(schema)
  const tables = await instance.client.raw(`show tables like '${schema.collName}'`)
  return tables[0].length > 0
}

export default collExists
