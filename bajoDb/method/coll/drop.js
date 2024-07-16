async function drop ({ schema, options = {} }) {
  const { importModule, currentLoc } = this.app.bajo
  const { getInfo } = this.app.bajoDb
  const { instance, driver } = getInfo(schema)
  const mod = await importModule(`${currentLoc(import.meta).dir}/../../lib/${driver.type}/coll-drop.js`)
  if (mod) return await mod.call(this, schema)
  return await instance.client.schema.dropTable(schema.collName)
}

export default drop
