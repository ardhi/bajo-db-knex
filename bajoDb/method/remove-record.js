import getRecord from './get-record.js'

async function removeRecord ({ schema, id, options = {} } = {}) {
  const { getInfo } = this.bajoDb.helper
  const { instance, returning } = await getInfo(schema)
  const { thrownNotFound = true } = options
  const rec = await getRecord.call(this, { schema, id, options: { thrownNotFound } })
  await instance.client(schema.collName)
    .where('id', id)
    .del(...returning)
  return rec
}

export default removeRecord
