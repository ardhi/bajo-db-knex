import sanitizeBody from './_sanitize-body.js'

async function create ({ schema, body, options } = {}) {
  const { importPkg, generateId } = this.bajo.helper
  const { getInfo } = this.bajoDb.helper
  const { has } = await importPkg('lodash-es')
  const { instance, returning } = await getInfo(schema)
  const nbody = sanitizeBody(body, schema)
  if (!has(nbody, 'id')) nbody.id = parseInt(generateId({ pattern: '1234567890', length: 12 }))
  return await instance.client(schema.collName).insert(nbody, ...returning)
}

export default create
