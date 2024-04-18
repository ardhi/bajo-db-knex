async function get ({ schema, id, options = {} } = {}) {
  const { error, importModule, currentLoc } = this.bajo.helper
  const { getInfo } = this.bajoDb.helper
  const { instance, driver } = getInfo(schema)
  const { thrownNotFound = true } = options
  let result
  const mod = await importModule(`${currentLoc(import.meta).dir}/../../lib/${driver.type}/record-get.js`)
  if (mod) result = await mod.call(this, { schema, id, options })
  else result = await instance.client(schema.collName).where('id', id)
  if (result.length === 0 && thrownNotFound) throw error('Record \'%s@%s\' not found!', id, schema.name, { statusCode: 404 })
  return { data: result[0] }
}

export default get
