async function count ({ schema, filter = {}, options = {} } = {}) {
  const { prepPagination, getInfo, importPkg } = this.bajoDb.helper
  const { instance } = await getInfo(schema)
  const mongoKnex = await importPkg('bajo-db:@tryghost/mongo-knex')
  const { query } = await prepPagination(filter, schema)
  // count
  let count = instance.client(schema.collName)
  if (query) count = mongoKnex(count, query)
  count = await count.count('*', { as: 'cnt' })
  count = count[0].cnt
  return { data: count }
}

export default count
