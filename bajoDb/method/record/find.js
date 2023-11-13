import getCount from './count.js'

async function find ({ schema, filter = {}, options = {} } = {}) {
  const { importPkg, importModule, currentLoc } = this.bajo.helper
  const { prepPagination, getInfo } = this.bajoDb.helper
  const { forOwn } = await importPkg('lodash-es')
  const mongoKnex = await importPkg('bajo-db:@tryghost/mongo-knex')
  const { instance, driver } = await getInfo(schema)
  const { noLimit, dataOnly } = options
  const { limit, skip, query, sort, page, noCount } = await prepPagination(filter, schema)
  let count = 0
  if (!noCount && !dataOnly) count = (await getCount.call(this, { schema, filter, options }) || {}).data
  let result
  const mod = await importModule(`${currentLoc(import.meta).dir}/../../lib/${driver.type}/record-find.js`)
  if (mod) result = await mod.call(this, { schema, filter, options })
  else {
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
    result = await data
  }
  return { data: result, page, limit, count, pages: Math.ceil(count / limit) }
}

export default find
