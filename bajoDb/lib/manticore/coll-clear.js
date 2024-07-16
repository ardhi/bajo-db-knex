async function clear ({ schema } = {}) {
  const { getInfo } = this.app.bajoDb
  const { instance } = getInfo(schema)
  await instance.client.raw(`truncate table ${schema.collName}`)
}

export default clear
