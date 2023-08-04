import getRecord from './get.js'

async function update ({ schema, id, body, options } = {}) {
  const { getInfo } = this.bajoDb.helper
  const { instance, returning } = await getInfo(schema)
  const old = await getRecord.call(this, { schema, id })
  const result = await instance.client(schema.repoName)
    .where('id', id)
    .update(body, ...returning)
  return { oldData: old.data, data: result[0] }
}

export default update
