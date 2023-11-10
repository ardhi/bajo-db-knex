function sanitizeBody (body, schema) {
  const nbody = {}
  for (const k in body) {
    const v = body[k]
    nbody[k] = v
    const prop = schema.properties.find(p => p.name === k)
    if (prop && prop.type === 'boolean' && v !== undefined && v !== null) nbody[k] = v ? 1 : 0
  }
  return nbody
}

export default sanitizeBody
