async function create ({ schema, body, options = {} } = {}) {
  const { isSet } = this.bajo.helper
  const { getInfo } = this.bajoDb.helper
  const { instance, returning } = await getInfo(schema)
  for (const p of schema.properties) {
    if (p.type === 'object' && isSet(body[p.name])) body[p.name] = JSON.stringify(body[p.name])
  }
  const result = await instance.client(schema.repoName)
    .insert(body, ...returning)
  return { data: result[0] }
}

export default create
