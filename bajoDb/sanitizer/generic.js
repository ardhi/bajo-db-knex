async function generic (item) {
  const { importPkg, fatal } = this.bajo.helper
  if (!item.connection) fatal('\'%s@%s\' key is required', 'connection', item.name, { code: 'BAJODB_GENERIC_MISSING_CONNECTION_KEY', payload: item })
  const { merge } = await importPkg('lodash-es')
  return merge({}, item, { memory: false })
}

export default generic
