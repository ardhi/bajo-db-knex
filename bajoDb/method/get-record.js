async function getRecord ({ schema, id, options = {} } = {}) {
  const { error } = this.bajo.helper
  const { getInfo } = this.bajoDb.helper
  const { instance } = await getInfo(schema)
  const { thrownNotFound = true, dataOnly = true } = options
  const result = await instance.client(schema.collName)
    .where('id', id)
  if (result.length === 0 && thrownNotFound) throw error('Record \'%s@%s\' not found!', id, schema.name)
  return dataOnly ? result[0] : { data: result[0] }
}

export default getRecord
