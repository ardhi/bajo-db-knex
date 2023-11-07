import knex from 'knex'
import collCreate from '../method/coll/create.js'
import FirebirdDialect from 'knex-firebird-dialect'
import collExists from '../method/coll/exists.js'

const extDialect = {
  firebird: FirebirdDialect.default
}

async function instantiation ({ connection, schemas, noRebuild }) {
  const { importPkg, log, fatal, error } = this.bajo.helper
  const { drivers } = this.bajoDbKnex.helper
  const { merge, pick, find } = await importPkg('lodash-es')
  this.bajoDbKnex.instances = this.bajoDbKnex.instances ?? []
  const driverPkg = find(drivers, { name: connection.type })
  const dialectFile = `knex/lib/dialects/${connection.type}/index.js`
  const Dialect = extDialect[connection.type] ?? (await import(dialectFile)).default
  let driver
  try {
    driver = await importPkg(`app:${driverPkg.adapter}`, { thrownNotFound: true })
  } catch (err) {
    throw error('Problem with \'%s\' driver file. Not installed yet?', driverPkg.adapter)
  }
  Dialect.prototype._driver = () => driver
  const instance = pick(connection, ['name', 'type'])
  instance.client = knex(merge({}, connection, { log, client: Dialect }))
  this.bajoDbKnex.instances.push(instance)
  const isMem = connection.type === 'sqlite3' && connection.connection.filename === ':memory:'
  if (isMem) noRebuild = false
  if (noRebuild) return
  for (const schema of schemas) {
    const exists = await collExists.call(this, schema)
    if (!exists) {
      try {
        await collCreate.call(this, schema)
        log.trace('Model \'%s@%s\' successfully built on the fly', schema.name, connection.name)
      } catch (err) {
        fatal('Unable to build model \'%s@%s\': %s', schema.name, connection.name, err.message)
      }
    }
  }
}

export default instantiation
