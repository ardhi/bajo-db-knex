import sanitizeBody from './_sanitize-body.js'

async function update ({ schema, id, body, options } = {}) {
  const { getInfo } = this.bajoDb.helper
  const { instance, returning } = await getInfo(schema)
  const nbody = sanitizeBody(body, schema)
  let result
  try {
    result = await instance.client(schema.collName).where('id', id).update(nbody, ...returning)
  } catch (err) {
    if (err.code === 'ER_PARSE_ERROR' && err.errno === 1064) {
      nbody.id = id
      const item = instance.client(schema.collName).insert(nbody, ...returning).toSQL().toNative()
      item.sql = 'replace' + item.sql.slice(6)
      result = await instance.client.raw(item.sql, item.bindings)
    } else throw err
  }
  return result
}

export default update
