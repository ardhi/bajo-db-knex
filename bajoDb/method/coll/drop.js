async function drop (schema) {
  const { getInfo } = this.bajoDb.helper
  const { instance } = await getInfo(schema)
  return await instance.client.schema.dropTable(schema.collName)
}

export default drop
