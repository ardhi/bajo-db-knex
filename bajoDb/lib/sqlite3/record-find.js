import applyFulltext from './_apply-fulltext.js'

async function find ({ schema, filter = {}, options = {} } = {}) {
  const { importPkg } = this.bajo.helper
  const { prepPagination, getInfo } = this.bajoDb.helper
  const { forOwn } = this.bajo.helper._
  const mongoKnex = await importPkg('bajoDb:@tryghost/mongo-knex')
  const { instance } = getInfo(schema)
  const { noLimit } = options
  const { limit, skip, query, sort, match } = await prepPagination(filter, schema)
  let data = instance.client(schema.collName)
  if (query) data = mongoKnex(data, query)
  await applyFulltext.call(this, schema, data, match)
  if (!noLimit) data.limit(limit, { skipBinding: true }).offset(skip)
  if (sort) {
    const sorts = []
    forOwn(sort, (v, k) => {
      sorts.push({ column: k, order: v < 0 ? 'desc' : 'asc' })
    })
    data.orderBy(sorts)
  }
  return await data
}

export default find
