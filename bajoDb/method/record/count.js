async function count ({ schema, filter = {}, options = {} } = {}) {
  const { importModule, currentLoc, importPkg } = this.bajo.helper
  const { prepPagination, getInfo } = this.bajoDb.helper
  const { instance, driver } = await getInfo(schema)
  const mongoKnex = await importPkg('bajo-db:@tryghost/mongo-knex')
  const { query } = await prepPagination(filter, schema)
  // count
  let result
  const mod = await importModule(`${currentLoc(import.meta).dir}/../../lib/${driver.type}/record-count.js`)
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
