async function applyFulltext (schema, data, match) {
  const { importPkg } = this.bajo.helper
  const { forOwn, isEmpty } = await importPkg('lodash-es')
  if (!isEmpty(match['*'])) {
    forOwn(match, (v, k) => {
      if (k !== '*') data.orWhereRaw(`MATCH(${k}) AGAINST ('${match['*']}' IN NATURAL LANGUAGE MODE)`)
    })
  } else {
    forOwn(match, (v, k) => {
      if (!isEmpty(v)) data.andWhereRaw(`MATCH(${k}) AGAINST ('${v.join(' ')}' IN NATURAL LANGUAGE MODE)`)
    })
  }
}

export default applyFulltext
