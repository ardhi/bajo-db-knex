import getKnex from '../../lib/get-knex.js'
import getRecord from './get-record.js'

async function updateRecord ({ schema, id, body, options } = {}) {
  const { sanitizeBody, pickRecord } = this.bajoDb.helper
  const { knex, returning } = await getKnex.call(this, schema)
  const { thrownNotFound = true, returnOldNew, fields } = options
  let old = await getRecord.call(this, { schema, id, options: { thrownNotFound } })
  old = await pickRecord(old, fields)
  const newBody = await sanitizeBody({ body, schema, partial: true })
  delete newBody.id
  let result = await knex(schema.collName)
    .where('id', id)
    .update(newBody, ...returning)
  result = await pickRecord(result[0], fields)
  if (returnOldNew) return { old, new: result }
  return result
}

export default updateRecord
