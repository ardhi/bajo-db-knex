async function clear ({ schema, options = {} } = {}) {
  const { truncate = true } = options
  const { getInfo } = this.bajoDb.helper
  const { instance } = await getInfo(schema)
  if (truncate) await instance.client(schema.collName).truncate()
  else await instance.client(schema.collName).del()
  return true
}

export default clear
