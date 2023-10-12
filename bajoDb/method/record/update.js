import getRecord from './get.js'

async function update ({ schema, id, body, options } = {}) {
  const { isSet } = this.bajo.helper
  const { getInfo } = this.bajoDb.helper
  const { instance, returning } = await getInfo(schema)
  for (const p of schema.properties) {
    if (p.type === 'object' && isSet(body[p.name])) body[p.name] = JSON.stringify(body[p.name])
  }
  const old = await getRecord.call(this, { schema, id })
  const result = await instance.client(schema.collName)
    .where('id', id)
    .update(body, ...returning)
  return { oldData: old.data, data: result[0] }
}

export default update
