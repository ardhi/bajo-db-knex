async function count ({ schema, filter, options = {} }) {
  const { error } = this.bajo.helper
  throw error('Unsupported aggregate \'count\'')
}

export default count
