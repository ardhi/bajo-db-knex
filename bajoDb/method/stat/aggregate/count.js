async function count ({ schema, filter, options = {} }) {
  const { importPkg } = this.bajo.helper
  const { camelCase } = this.bajo.helper._
  const { getInfo, prepPagination } = this.bajoDb.helper
  const { instance } = getInfo(schema)
  const mongoKnex = await importPkg('bajoDb:@tryghost/mongo-knex')
  const { limit, skip, sort, page } = await prepPagination(filter, schema, { allowSortUnindexed: true })
  const fields = options.fields ?? ['*']
  const [field] = fields
  let cursor = instance.client(schema.collName)
  if (filter.query) cursor = mongoKnex(cursor, filter.query)
  if (field === '*') {
    const data = await cursor.count(field, { as: 'count' })
    return { data, page, limit }
  }
  const colName = camelCase(`${field} count`)
  if (!options.noLimit) cursor.limit(limit, { skipBinding: true }).offset(skip)
  cursor.select(field).groupBy(field)
  if (sort) {
    const f = Object.keys(sort)[0]
    let d = sort[f]
    d = d <= 0 ? 'desc' : 'asc'
    cursor.orderBy(f, d)
  }
  const data = await cursor.count(field, { as: colName })
  return { data, page, limit }
}

export default count
