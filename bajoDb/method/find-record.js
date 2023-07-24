import getKnex from '../../lib/get-knex.js'

async function findRecord ({ schema, filter = {}, options = {} } = {}) {
  const { importPkg } = this.bajo.helper
  const { prepPagination, pickRecord } = this.bajoDb.helper
  const { forOwn } = await importPkg('lodash-es')
  const { knex } = await getKnex.call(this, schema)
  const { noLimit, fields } = options
  const { limit, skip, query, sort } = await prepPagination(filter, schema)
  let op = knex(schema.collName)
  if (query) op = query.querySQL(op)
  if (!noLimit) op.limit(limit, { skipBinding: true }).offset(skip)
  if (sort) {
    const sorts = []
    forOwn(sort, (v, k) => {
      sorts.push({ column: k, order: v < 0 ? 'desc' : 'asc' })
    })
    op.orderBy(sorts)
  }
  const results = await op
  for (const i in results) {
    results[i] = await pickRecord(results[i], fields)
  }
  return results
}

export default findRecord
