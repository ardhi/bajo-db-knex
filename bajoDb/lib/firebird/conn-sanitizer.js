import path from 'path'

async function connSanitizer (item) {
  const { fatal, getConfig, importPkg, resolvePath } = this.bajo.helper
  if (!item.connection) fatal('\'%s@%s\' key is required', 'connection', item.name, { payload: item })
  const { isEmpty, pick } = await importPkg('lodash-es')
  const fs = await importPkg('fs-extra')
  const config = getConfig()
  const newItem = pick(item, ['name', 'type', 'connection'])
  for (const i of ['database', 'user', 'password']) {
    if (!item.connection[i]) fatal('\'%s@%s\' key is required', i, item.name, { payload: item })
  }
  if (!path.isAbsolute(item.connection.database)) {
    let file = resolvePath(`${config.dir.data}/db/${item.connection.database}`)
    const ext = path.extname(file)
    if (isEmpty(ext)) file += '.fdb'
    fs.ensureDirSync(path.dirname(file))
    newItem.connection.database = file
  }
  newItem.connection.host = newItem.connection.host ?? 'localhost'
  newItem.connection.port = newItem.connection.port ?? 3050
  newItem.createDatabaseIfNotExists = true
  return newItem
}

export default connSanitizer
