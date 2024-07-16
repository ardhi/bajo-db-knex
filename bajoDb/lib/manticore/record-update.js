import sanitizeInput from './_sanitize-input.js'

async function update ({ schema, id, body, oldBody, options } = {}) {
  const { getInfo } = this.app.bajoDb
  const { merge } = this.app.bajo.lib._
  const { instance, returning } = getInfo(schema)
  const nbody = merge({}, oldBody, sanitizeInput.call(this, body, schema))
  nbody.id = id
  const item = instance.client(schema.collName).insert(nbody, ...returning).toSQL().toNative()
  item.sql = 'replace' + item.sql.slice(6)
  return await instance.client.raw(item.sql, item.bindings)
}

export default update
