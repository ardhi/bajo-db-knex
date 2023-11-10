async function drop (schema) {
  const { importModule, currentLoc } = this.bajo.helper
  const { getInfo } = this.bajoDb.helper
  const { instance, driver } = await getInfo(schema)
  const mod = await importModule(`${currentLoc(import.meta).dir}/../../lib/${driver.type}/coll-drop.js`)
  if (mod) return await mod.call(this, schema)
  return await instance.client.schema.dropTable(schema.collName)
}

export default drop
