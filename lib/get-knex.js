async function getKnex (schema) {
  const { importPkg } = this.bajo.helper
  const { find, map } = await importPkg('lodash-es')
  const conn = find(this.bajoDb.connections, { name: schema.connection })
  const knex = find(this.bajoDbKnex.instances, { name: schema.connection }).client
  const opts = conn.type === 'mssql' ? { includeTriggerModifications: true } : undefined
  const returning = [map(schema.properties, 'name'), opts]
  return { knex, conn, returning }
}

export default getKnex
