function lib ({ schema, aggregate, group }) {
  const { isSet, error } = this.bajo.helper
  const { camelCase } = this.bajo.helper._
  const { aggregateTypes } = this.bajoDb.helper
  if (aggregate === 'count') return ['count(*) as count']
  if (!isSet(group)) throw error('Group field to aggregate is missing')
  const prop = schema.properties.find(p => p.name === group)
  if (!prop) throw error('Unknown group field \'%s@%s\'', group, schema.name)
  if (!['integer', 'smallint', 'float'].includes(prop.type)) throw error('Group field must be of type integer, smallint or float')
  const types = aggregate.split(',').map(a => a.trim())
  const aggs = []
  for (const type of types) {
    if (!aggregateTypes.includes(type)) throw error('Unsupported aggregate type: \'%s\'', type)
    const name = camelCase(`${group} ${type}`)
    aggs.push(`${type}(${type === 'count' ? '*' : group}) as ${name}`)
  }
  return aggs
}

export default lib
