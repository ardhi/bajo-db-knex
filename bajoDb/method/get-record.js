import getKnex from '../../lib/get-knex.js'

async function getRecord ({ schema, id, options = {} } = {}) {
  const { error } = this.bajo.helper
  const { pickRecord } = this.bajoDb.helper
  const { knex } = await getKnex.call(this, schema)
  const { thrownNotFound = true, fields } = options
  const result = await knex(schema.collName)
    .where('id', id)
  if (result.length === 0 && thrownNotFound) throw error('Record \'%s@%s\' not found!', id, schema.name)
  return await pickRecord(result[0], fields)
}

export default getRecord
