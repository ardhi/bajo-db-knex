async function get ({ schema, id, options = {} }) {
  const { importModule, currentLoc } = this.app.bajo
  const { getInfo } = this.app.bajoDb
  const { instance, driver } = getInfo(schema)
  const { thrownNotFound = true } = options
  let result
  const mod = await importModule(`${currentLoc(import.meta).dir}/../../lib/${driver.type}/record-get.js`)
  if (mod) result = await mod.call(this, { schema, id, options })
  else result = await instance.client(schema.collName).where('id', id)
  if (result.length === 0 && thrownNotFound) throw this.error('Record \'%s@%s\' not found!', id, schema.name, { statusCode: 404 })
  return { data: result[0] }
}

export default get
