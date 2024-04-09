import getRecord from './get.js'

async function update ({ schema, id, body, options } = {}) {
  const { isSet, importModule, currentLoc, importPkg } = this.bajo.helper
  const { getInfo } = this.bajoDb.helper
  const { pick } = await importPkg('lodash-es')
  const { instance, returning, driver } = await getInfo(schema)
  for (const p of schema.properties) {
    if (['object', 'array'].includes(p.type) && isSet(body[p.name])) body[p.name] = JSON.stringify(body[p.name])
  }
  const old = options.noResult ? undefined : await getRecord.call(this, { schema, id })
  let result
  const mod = await importModule(`${currentLoc(import.meta).dir}/../../lib/${driver.type}/record-update.js`)
  if (mod) result = await mod.call(this, { schema, id, body, oldBody: old.data, options })
  else result = await instance.client(schema.collName).where('id', id).update(body, ...returning)
  if (options.noResult) return
  if (!driver.returning) {
    const resp = await getRecord.call(this, { schema, id, options: { thrownNotFound: false } })
    if (returning[0].length > 0) resp.data = pick(resp.data, returning[0])
    result = [resp.data]
  }
  return { oldData: old.data, data: result[0] }
}

export default update
