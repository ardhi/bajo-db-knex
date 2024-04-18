import applyFulltext from './_apply-fulltext.js'

async function count ({ schema, filter = {}, options = {} } = {}) {
  const { importPkg } = this.bajo.helper
  const { prepPagination, getInfo } = this.bajoDb.helper
  const { instance } = getInfo(schema)
  const mongoKnex = await importPkg('bajoDb:@tryghost/mongo-knex')
  const { query, match } = await prepPagination(filter, schema)
  let result = instance.client(schema.collName)
  if (query) result = mongoKnex(result, query)
  await applyFulltext.call(this, schema, result, match)
  result = await result.count('*', { as: 'cnt' })
  return result[0].cnt
}

export default count
