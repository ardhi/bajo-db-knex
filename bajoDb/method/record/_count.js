async function count ({ schema, type, filter = {}, options = {} }) {
  const { importModule, currentLoc, importPkg } = this.bajo.helper
  const { getInfo } = this.bajoDb.helper
  const { instance, driver } = getInfo(schema)
  const mongoKnex = await importPkg('bajoDb:@tryghost/mongo-knex')
  // count
  let result
  const mod = await importModule(`${currentLoc(import.meta).dir}/../../lib/${driver.type}/_record-count.js`)
  if (mod) result = await mod.call(this, { schema, filter, options })
  else {
    result = instance.client(schema.collName)
    if (filter.query) result = mongoKnex(result, filter.query)
    result = await result.count('*', { as: 'cnt' })
    result = result[0].cnt
  }
  return { data: result }
}

export default count
