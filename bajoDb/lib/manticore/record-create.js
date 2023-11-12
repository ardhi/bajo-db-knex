import sanitizeInput from './_sanitize-input.js'

async function create ({ schema, body, options } = {}) {
  const { getInfo } = this.bajoDb.helper
  const { instance, returning } = await getInfo(schema)
  const nbody = sanitizeInput.call(this, body, schema)
  return await instance.client(schema.collName).insert(nbody, ...returning)
}

export default create
