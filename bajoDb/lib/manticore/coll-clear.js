async function clear ({ schema } = {}) {
  const { getInfo } = this.bajoDb.helper
  const { instance } = getInfo(schema)
  await instance.client.raw(`truncate table ${schema.collName}`)
}

export default clear
