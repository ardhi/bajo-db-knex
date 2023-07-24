import getRecord from './get-record.js'
import getKnex from '../../lib/get-knex.js'

async function removeRecord ({ schema, id, options = {} } = {}) {
  const { pickRecord } = this.bajoDb.helper
  const { knex, returning } = await getKnex.call(this, schema)
  const { thrownNotFound = true, fields } = options
  let rec = await getRecord.call(this, { schema, id, options: { thrownNotFound } })
  rec = await pickRecord(rec, fields)
  await knex(schema.collName)
    .where('id', id)
    .del(...returning)
  return rec
}

export default removeRecord
