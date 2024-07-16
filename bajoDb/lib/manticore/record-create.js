import sanitizeInput from './_sanitize-input.js'

async function create ({ schema, body, options } = {}) {
  const { generateId, isSet } = this.app.bajo
  const { getInfo } = this.app.bajoDb
  const { instance, returning } = getInfo(schema)
  const nbody = sanitizeInput.call(this, body, schema)
  if (!isSet(nbody.id)) nbody.id = generateId('int')
  return await instance.client(schema.collName).insert(nbody, ...returning)
}

export default create
