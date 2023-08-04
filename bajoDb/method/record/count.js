async function count ({ schema, filter = {}, options = {} } = {}) {
  const { prepPagination, getInfo } = this.bajoDb.helper
  const { instance } = await getInfo(schema)
  const { query } = await prepPagination(filter, schema)
  // count
  let count = instance.client(schema.repoName)
  if (query) count = query.querySQL(count)
  count = await count.count('*', { as: 'cnt' })
  count = count[0].cnt
  return { data: count }
}

export default count
