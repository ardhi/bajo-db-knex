async function findRecord ({ schema, filter = {}, options = {} } = {}) {
  const { importPkg } = this.bajo.helper
  const { prepPagination, getInfo } = this.bajoDb.helper
  const { forOwn } = await importPkg('lodash-es')
  const { instance } = await getInfo(schema)
  const { noLimit } = options
  const { limit, skip, query, sort } = await prepPagination(filter, schema)
  let op = instance.client(schema.collName)
  if (query) op = query.querySQL(op)
  if (!noLimit) op.limit(limit, { skipBinding: true }).offset(skip)
  if (sort) {
    const sorts = []
    forOwn(sort, (v, k) => {
      sorts.push({ column: k, order: v < 0 ? 'desc' : 'asc' })
    })
    op.orderBy(sorts)
  }
  return await op
}

export default findRecord
