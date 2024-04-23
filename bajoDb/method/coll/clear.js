async function clear ({ schema, options = {} }) {
  const { importModule, currentLoc } = this.bajo.helper
  const { truncate = true } = options
  const { getInfo } = this.bajoDb.helper
  const { instance, driver } = getInfo(schema)
  const method = truncate ? 'truncate' : 'del'
  const mod = await importModule(`${currentLoc(import.meta).dir}/../../lib/${driver.type}/coll-clear.js`)
  if (mod) await mod.call(this, { schema, options })
  else await instance.client(schema.collName)[method]()
  return true
}

export default clear
