async function count ({ schema, filter = {}, options = {} } = {}) {
  const { importPkg } = this.bajo.helper
  const { prepPagination, getInfo } = this.bajoDb.helper
  const { instance } = await getInfo(schema)
  const mongoKnex = await importPkg('bajo-db:@tryghost/mongo-knex')
  const { query } = await prepPagination(filter, schema)
  let result = instance.client(schema.collName)
  if (query) result = mongoKnex(result, query)
  const item = result.count('*', { as: 'cnt' }).toSQL().toNative()
  item.sql = item.sql.replaceAll('`' + schema.collName + '`.', '')
  result = await instance.client.raw(item.sql, item.bindings)
  return result[0][0].cnt
}

export default count
