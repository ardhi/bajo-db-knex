async function generic (item) {
  const { importPkg, fatal } = this.bajo.helper
  if (!item.connection) fatal('\'%s@%s\' key is required', 'connection', item.name, { payload: item })
  const { merge } = await importPkg('lodash-es')
  return merge({}, item)
}

export default generic
