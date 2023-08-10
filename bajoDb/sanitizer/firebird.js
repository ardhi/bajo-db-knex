import path from 'path'

async function firebird (item) {
  const { fatal, getConfig, importPkg, resolvePath } = this.bajo.helper
  if (!item.connection) fatal('\'%s@%s\' key is required', 'connection', item.name, { code: 'BAJODBKNEX_FIREBIRD_MISSING_CONNECTION_KEY', payload: item })
  const { isEmpty, pick } = await importPkg('lodash-es')
  const fs = await importPkg('fs-extra')
  const config = getConfig()
  const newItem = pick(item, ['name', 'type', 'connection'])
  for (const i of ['database', 'user', 'password']) {
    if (!item.connection[i]) fatal('\'%s@%s\' key is required', i, item.name, { code: 'BAJODBKNEX_FIREBIRD_MISSING_CONNECTION_' + i.toUpperCase(), payload: item })
  }
  if (!path.isAbsolute(item.connection.database)) {
    let file = resolvePath(`${config.dir.data}/db/${item.connection.database}`)
    const ext = path.extname(file)
    if (isEmpty(ext)) file += '.fdb'
    fs.ensureDirSync(path.dirname(file))
    newItem.connection.database = file
  }
  newItem.connection.host = newItem.connection.host || 'localhost'
  newItem.connection.port = newItem.connection.port || 3050
  newItem.createDatabaseIfNotExists = true
  return newItem
}

export default firebird
