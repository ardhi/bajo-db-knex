async function common ({ type, schema, filter, options = {} }) {
  const { error } = this.bajo.helper
  throw error('Unsupported aggregate \'%s\'', type)
}

export default common
