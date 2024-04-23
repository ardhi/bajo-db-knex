async function count ({ schema, type, filter = {}, options = {} }) {
  const { importModule, currentLoc, importPkg } = this.bajo.helper
  const { prepPagination, getInfo } = this.bajoDb.helper
  const { instance, driver } = getInfo(schema)
  const mongoKnex = await importPkg('bajoDb:@tryghost/mongo-knex')
  const { query } = await prepPagination(filter, schema)
  // count
  let result
  const mod = await importModule(`${currentLoc(import.meta).dir}/../../lib/${driver.type}/_record-count.js`)
  if (mod) result = await mod.call(this, { schema, filter, options })
  else {
    result = instance.client(schema.collName)
    if (query) result = mongoKnex(result, query)
    result = await result.count('*', { as: 'cnt' })
    result = result[0].cnt
  }
  return { data: result }
}

export default count
