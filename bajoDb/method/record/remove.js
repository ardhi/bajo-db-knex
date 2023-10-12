import getRecord from './get.js'

async function remove ({ schema, id, options = {} } = {}) {
  const { getInfo } = this.bajoDb.helper
  const { instance, returning } = await getInfo(schema)
  const rec = await getRecord.call(this, { schema, id })
  await instance.client(schema.collName)
    .where('id', id)
    .del(...returning)
  return { oldData: rec.data }
}

export default remove
