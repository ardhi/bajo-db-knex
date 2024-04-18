import sanitizeOutput from './_sanitize-output.js'

async function get ({ schema, id, options } = {}) {
  const { getInfo } = this.bajoDb.helper
  const { instance } = getInfo(schema)
  const result = await instance.client(schema.collName).where('id', id)
  return result.map(r => {
    return sanitizeOutput.call(this, r, schema)
  })
}

export default get
