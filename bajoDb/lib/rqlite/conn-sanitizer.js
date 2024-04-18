async function connSanitizer (item) {
  const { fatal } = this.bajo.helper
  if (!item.connection) fatal('\'%s@%s\' key is required', 'connection', item.name, { payload: item })
  const { pick } = this.bajo.helper._
  const newItem = pick(item, ['name', 'type', 'connection'])
  newItem.connection.host = newItem.connection.host ?? 'localhost'
  newItem.connection.port = newItem.connection.port ?? 4001
  return newItem
}

export default connSanitizer
