import getRecord from './get-record.js'

async function updateRecord ({ schema, id, body, options } = {}) {
  const { getInfo } = this.bajoDb.helper
  const { instance, returning } = await getInfo(schema)
  const old = await getRecord.call(this, { schema, id })
  const result = await instance.client(schema.collName)
    .where('id', id)
    .update(body, ...returning)
  return { old: old.data, new: result[0] }
}

export default updateRecord
