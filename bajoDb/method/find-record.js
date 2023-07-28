async function findRecord ({ schema, filter = {}, options = {} } = {}) {
  const { importPkg } = this.bajo.helper
  const { prepPagination, getInfo } = this.bajoDb.helper
  const { forOwn } = await importPkg('lodash-es')
  const { instance } = await getInfo(schema)
  const { noLimit, dataOnly } = options
  const { limit, skip, query, sort, page } = await prepPagination(filter, schema)
  // count
  let count
  if (dataOnly) count = 0
  else {
    count = instance.client(schema.collName)
    if (query) count = query.querySQL(count)
    count = await count.count('*', { as: 'cnt' })
    count = count[0].cnt
  }
  // data
  let data = instance.client(schema.collName)
  if (query) data = query.querySQL(data)
  if (!noLimit) data.limit(limit, { skipBinding: true }).offset(skip)
  if (sort) {
    const sorts = []
    forOwn(sort, (v, k) => {
      sorts.push({ column: k, order: v < 0 ? 'desc' : 'asc' })
    })
    data.orderBy(sorts)
  }
  const results = await data
  return { data: results, page, limit, count, pages: Math.ceil(count / limit) }
}

export default findRecord
