async function create ({ schema, body, options = {} } = {}) {
  const { getInfo } = this.bajoDb.helper
  const { instance, returning } = await getInfo(schema)
  const result = await instance.client(schema.repoName)
    .insert(body, ...returning)
  return { data: result[0] }
}

export default create
