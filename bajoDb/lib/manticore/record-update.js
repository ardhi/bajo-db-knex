import sanitizeInput from './_sanitize-input.js'

async function update ({ schema, id, body, options } = {}) {
  const { getInfo } = this.bajoDb.helper
  const { instance, returning } = await getInfo(schema)
  const nbody = sanitizeInput.call(this, body, schema)
  nbody.id = id
  const item = instance.client(schema.collName).insert(nbody, ...returning).toSQL().toNative()
  item.sql = 'replace' + item.sql.slice(6)
  return await instance.client.raw(item.sql, item.bindings)
}

export default update
