async function find ({ schema, filter = {}, options = {} } = {}) {
  const { importPkg } = this.bajo.helper
  const { prepPagination, getInfo } = this.bajoDb.helper
  const { forOwn } = await importPkg('lodash-es')
  const mongoKnex = await importPkg('bajo-db:@tryghost/mongo-knex')
  const { instance } = await getInfo(schema)
  const { noLimit } = options
  const { limit, skip, query, sort } = await prepPagination(filter, schema)
  let data = instance.client(schema.collName)
  if (query) data = mongoKnex(data, query)
  if (!noLimit) data.limit(limit, { skipBinding: true }).offset(skip)
  if (sort) {
    const sorts = []
    forOwn(sort, (v, k) => {
      sorts.push({ column: k, order: v < 0 ? 'desc' : 'asc' })
    })
    data.orderBy(sorts)
  }
  const item = data.toSQL().toNative()
  item.sql = item.sql.replaceAll('`' + schema.collName + '`.', '')
  const result = await instance.client.raw(item.sql, item.bindings)
  return result[0]
}

export default find