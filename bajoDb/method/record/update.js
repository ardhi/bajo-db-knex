import getRecord from './get.js'

async function update ({ schema, id, body, options } = {}) {
  const { isSet, importPkg } = this.bajo.helper
  const { getInfo } = this.bajoDb.helper
  const { drivers } = this.bajoDbKnex.helper
  const { pick } = await importPkg('lodash-es')
  const { instance, returning, connection } = await getInfo(schema)
  for (const p of schema.properties) {
    if (p.type === 'object' && isSet(body[p.name])) body[p.name] = JSON.stringify(body[p.name])
  }
  const old = await getRecord.call(this, { schema, id })
  const driver = drivers.find(d => d.name === connection.type)
  let result = await instance.client(schema.collName).where('id', id).update(body, ...returning)
  if (!driver.returning) {
    const resp = await getRecord.call(this, { schema, id: body.id, options: { thrownNotFound: false } })
    if (returning[0].length > 0) resp.data = pick(resp.data, returning[0])
    result = [resp.data]
  }
  return { oldData: old.data, data: result[0] }
}

export default update
