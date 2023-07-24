import getKnex from '../../lib/get-knex.js'

async function createRecord ({ schema, body, options = {} } = {}) {
  const { generateId } = this.bajo.helper
  const { sanitizeBody, pickRecord } = this.bajoDb.helper
  const { fields } = options
  const { knex, returning } = await getKnex.call(this, schema)
  const newBody = await sanitizeBody.call(this, { body, schema })
  newBody.id = generateId()
  const result = await knex(schema.collName)
    .insert(newBody, ...returning)
  return await pickRecord(result[0], fields)
}

export default createRecord
