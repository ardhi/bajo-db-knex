import getRecord from './get.js'

async function remove ({ schema, id, options = {} }) {
  const { importModule, currentLoc } = this.bajo.helper
  const { noResult } = options
  const { getInfo } = this.bajoDb.helper
  const { instance, driver } = getInfo(schema)
  const mod = await importModule(`${currentLoc(import.meta).dir}/../../lib/${driver.type}/record-remove.js`)
  const rec = noResult ? undefined : await getRecord.call(this, { schema, id })
  if (mod) await mod.call(this, { schema, id, options })
  else await instance.client(schema.collName).where('id', id).del()
  return noResult ? undefined : { oldData: rec.data }
}

export default remove
