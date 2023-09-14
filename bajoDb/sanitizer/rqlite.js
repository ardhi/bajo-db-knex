async function rqlite (item) {
  const { fatal, importPkg } = this.bajo.helper
  if (!item.connection) fatal('\'%s@%s\' key is required', 'connection', item.name, { payload: item })
  const { pick } = await importPkg('lodash-es')
  const newItem = pick(item, ['name', 'type', 'connection'])
  newItem.connection.host = newItem.connection.host ?? 'localhost'
  newItem.connection.port = newItem.connection.port ?? 4001
  return newItem
}

export default rqlite
