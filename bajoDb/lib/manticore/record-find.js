import sanitizeOutput from './_sanitize-output.js'
import applyFulltext from './_apply-fulltext.js'

async function find ({ schema, filter = {}, options = {} } = {}) {
  const { importPkg, dayjs, getConfig } = this.bajo.helper
  const { prepPagination, getInfo } = this.bajoDb.helper
  const { forOwn, get } = this.bajo.helper._
  const mongoKnex = await importPkg('bajoDb:@tryghost/mongo-knex')
  const cfg = getConfig('bajoDbKnex')
  const { instance } = getInfo(schema)
  const { noLimit } = options
  const { limit, skip, sort } = await prepPagination(filter, schema)
  let data = instance.client(schema.collName)
  if (filter.query) data = mongoKnex(data, filter.query)
  await applyFulltext.call(this, data, filter.match)
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
  const maxMatches = get(options, 'req.headers.x-max-matches', cfg.manticore.maxMatches)
  item.sql += ` option max_matches=${maxMatches}`
  for (const i in item.bindings) {
    const val = item.bindings[i]
    if (val instanceof Date) item.bindings[i] = dayjs(val).unix()
  }
  const result = await instance.client.raw(item.sql, item.bindings)
  return result[0].map(r => {
    return sanitizeOutput.call(this, r, schema)
  })
}

export default find
