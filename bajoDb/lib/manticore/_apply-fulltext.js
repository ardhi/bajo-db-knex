async function applyFulltext (data, match) {
  const { importPkg } = this.bajo.helper
  const { forOwn, isEmpty } = await importPkg('lodash-es')
  const matches = []
  forOwn(match, (v, k) => {
    if (!isEmpty(v)) matches.push(`@${k} ${v.join(' ')}`)
  })
  if (!isEmpty(matches)) data.andWhereRaw(`match('${matches.join(' ')}')`)
}

export default applyFulltext
