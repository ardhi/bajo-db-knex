async function createRecord ({ schema, body, options = {} } = {}) {
  const { getInfo } = this.bajoDb.helper
  const { instance, returning } = await getInfo(schema)
  const result = await instance.client(schema.collName)
    .insert(body, ...returning)
  return result[0]
}

export default createRecord
