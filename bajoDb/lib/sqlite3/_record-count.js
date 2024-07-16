import applyFulltext from './_apply-fulltext.js'

async function count ({ schema, filter = {}, options = {} } = {}) {
  const { importPkg } = this.app.bajo
  const { getInfo } = this.app.bajoDb
  const { instance } = getInfo(schema)
  const mongoKnex = await importPkg('bajoDb:@tryghost/mongo-knex')
  let result = instance.client(schema.collName)
  if (filter.query) result = mongoKnex(result, filter.query)
  await applyFulltext.call(this, schema, result, filter.match)
  result = await result.count('*', { as: 'cnt' })
  return result[0].cnt
}

export default count
