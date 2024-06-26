async function common ({ schema, filter, options = {} }) {
  const { importPkg, error } = this.bajo.helper
  const { camelCase } = this.bajo.helper._
  const { getInfo, prepPagination, aggregateTypes } = this.bajoDb.helper
  const { instance } = getInfo(schema)
  const mongoKnex = await importPkg('bajoDb:@tryghost/mongo-knex')
  const { limit, skip, sort, page } = await prepPagination(filter, schema, { allowSortUnindexed: true })
  const group = options.group
  if (!group) throw error('Field to group aggregate is missing')
  const [field] = options.fields ?? []
  if (!field) throw error('Field to calculate aggregate is missing')
  let cursor = instance.client(schema.collName)
  if (filter.query) cursor = mongoKnex(cursor, filter.query)
  if (!options.noLimit) cursor.limit(limit, { skipBinding: true }).offset(skip)
  cursor.select(group).groupBy(group)
  if (sort) {
    const f = Object.keys(sort)[0]
    let d = sort[f]
    d = d <= 0 ? 'desc' : 'asc'
    cursor.orderBy(f, d)
  }
  for (const t of (options.aggregate ?? '').split(',')) {
    if (!aggregateTypes.includes(t)) throw error('Unsupported aggregate: \'%s\'', t)
    cursor[t](field, { as: camelCase(`${field} ${t}`) })
  }
  const data = await cursor
  return { data, page, limit }
}

export default common
