async function exists ({ schema, options = {} }) {
  const { importModule, currentLoc } = this.bajo.helper
  const { getInfo } = this.bajoDb.helper
  const { instance, driver } = getInfo(schema)
  const mod = await importModule(`${currentLoc(import.meta).dir}/../../lib/${driver.type}/coll-exists.js`)
  if (mod) return await mod.call(this, schema)
  const exists = await instance.client.schema.hasTable(schema.collName)
  return !!exists
}

export default exists
