import knex from 'knex'
import repoCreate from '../method/repo/create.js'
import FirebirdDialect from 'knex-firebird-dialect'
import repoExists from '../method/repo/exists.js'

const extDialect = {
  firebird: FirebirdDialect.default
}

async function instantiation ({ connection, schemas, noRebuild }) {
  const { importPkg, log, fatal, readJson, currentLoc } = this.bajo.helper
  const { merge, pick } = await importPkg('lodash-es')
  this.bajoDbKnex.instances = this.bajoDbKnex.instances || []
  const driverPkg = readJson(`${currentLoc(import.meta).dir}/../../lib/driver-pkg.json`)
  const dialectFile = `knex/lib/dialects/${connection.type}/index.js`
  const Dialect = extDialect[connection.type] || (await import(dialectFile)).default
  const driver = await importPkg(`app:${driverPkg[connection.type]}`)
  Dialect.prototype._driver = () => driver
  const instance = pick(connection, ['name', 'type'])
  instance.client = knex(merge({}, connection, { log, client: Dialect }))
  this.bajoDbKnex.instances.push(instance)
  const isMem = connection.type === 'sqlite3' && connection.connection.filename === ':memory:'
  if (isMem) noRebuild = false
  if (noRebuild) return
  for (const schema of schemas) {
    const exists = await repoExists.call(this, schema)
    if (!exists) {
      try {
        await repoCreate.call(this, schema)
        log.trace('Model \'%s@%s\' successfully built on the fly', schema.name, connection.name)
      } catch (err) {
        fatal('Unable to build model \'%s@%s\': %s', schema.name, connection.name, err.message)
      }
    }
  }
}

export default instantiation
