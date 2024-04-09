async function clear ({ schema } = {}) {
  const { getInfo } = this.bajoDb.helper
  const { instance } = await getInfo(schema)
  await instance.client.raw(`truncate table ${schema.collName}`)
}

export default clear
