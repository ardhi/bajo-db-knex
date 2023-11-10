import getRecord from './get.js'

async function remove ({ schema, id, options = {} } = {}) {
  const { importModule, currentLoc } = this.bajo.helper
  const { getInfo } = this.bajoDb.helper
  const { instance, driver } = await getInfo(schema)
  const rec = await getRecord.call(this, { schema, id })
  const mod = await importModule(`${currentLoc(import.meta).dir}/../../lib/${driver.type}/record-remove.js`)
  if (mod) await mod.call(this, { schema, id, options })
  else await instance.client(schema.collName).where('id', id).del()
  return { oldData: rec.data }
}

export default remove
