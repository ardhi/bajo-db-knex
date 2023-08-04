async function exists (schema) {
  const { getInfo } = this.bajoDb.helper
  const { instance } = await getInfo(schema)
  const exists = await instance.client.schema.hasTable(schema.repoName)
  return !!exists
}

export default exists
