import path from 'path'

async function sqlite3 (item) {
  const { fatal, getConfig, importPkg, pathResolve } = this.bajo.helper
  if (!item.connection) fatal('\'%s@%s\' key is required', 'connection', item.name, { code: 'BAJODBKNEX_SQLITE3_MISSING_CONNECTION_KEY', payload: item })
  const { isEmpty, pick } = await importPkg('lodash-es')
  const fs = await importPkg('fs-extra')
  const config = getConfig()
  const newItem = pick(item, ['name', 'type', 'connection'])
  if (!item.connection.filename) fatal('\'%s@%s\' key is required', 'filename', item.name, { code: 'BAJODBKNEX_SQLITE3_MISSING_CONNECTION_FILENAME', payload: item })
  if (item.connection.filename !== ':memory:' && !path.isAbsolute(item.connection.filename)) {
    let file = pathResolve(`${config.dir.data}/db/${item.connection.filename}`)
    const ext = path.extname(file)
    if (isEmpty(ext)) file += '.sqlite3'
    fs.ensureDirSync(path.dirname(file))
    newItem.connection.filename = file
  }
  newItem.useNullAsDefault = true
  return newItem
}

export default sqlite3
