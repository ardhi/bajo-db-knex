import path from 'path'

async function sqlite3 (item) {
  const { fatal, importPkg, getPluginDataDir } = this.bajo.helper
  if (!item.connection) fatal('\'%s@%s\' key is required', 'connection', item.name, { payload: item })
  const { isEmpty, pick } = await importPkg('lodash-es')
  const fs = await importPkg('fs-extra')
  const newItem = pick(item, ['name', 'type', 'connection'])
  if (!item.connection.filename) fatal('\'%s@%s\' key is required', 'filename', item.name, { payload: item })
  if (item.connection.filename !== ':memory:' && !path.isAbsolute(item.connection.filename)) {
    let file = `${getPluginDataDir('bajoDb')}/db/${item.connection.filename}`
    const ext = path.extname(file)
    if (isEmpty(ext)) file += '.sqlite3'
    fs.ensureDirSync(path.dirname(file))
    newItem.connection.filename = file
  }
  newItem.useNullAsDefault = true
  newItem.memory = item.connection.filename === ':memory:'
  return newItem
}

export default sqlite3
