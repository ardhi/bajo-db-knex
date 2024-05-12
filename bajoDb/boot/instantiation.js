import knex from 'knex'
import collCreate from '../method/coll/create.js'
import collExists from '../method/coll/exists.js'

const stripWarns = [
  '.returning() is not supported by mysql and will not have any effect'
]

const extDialect = {
}

async function instantiation ({ connection, schemas, noRebuild = true }) {
  const { fs, importPkg, log, fatal, error, currentLoc } = this.bajo.helper
  const { drivers } = this.bajoDbKnex.helper
  const { merge, pick, find } = this.bajo.helper._
  this.bajoDbKnex.instances = this.bajoDbKnex.instances ?? []
  const [, type] = connection.type.split(':')
  const driverPkg = find(drivers, { name: type })
  const dialect = driverPkg.dialect ?? type
  let dialectFile = `${currentLoc(import.meta).dir}/dialect/${dialect}.js`
  if (!fs.existsSync(dialectFile)) dialectFile = `knex/lib/dialects/${dialect}/index.js`
  const Dialect = extDialect[type] ?? (await import(dialectFile)).default
  let driver
  try {
    driver = await importPkg(`app:${driverPkg.adapter}`, { thrownNotFound: true })
  } catch (err) {
    throw error('Problem with \'%s\' driver file. Not installed yet?', driverPkg.adapter)
  }
  Dialect.prototype._driver = () => driver
  const instance = pick(connection, ['name', 'type'])
  const knexLog = {
    error: log.error,
    debug: log.debug,
    deprecate: log.warn,
    warn: msg => {
      let match
      for (const w of stripWarns) {
        if (msg.includes(w)) match = true
      }
      if (match) return
      return log.warn(msg)
    }
  }
  instance.client = knex(merge({}, connection, { log: knexLog, client: Dialect }))
  this.bajoDbKnex.instances.push(instance)
  const isMem = type === 'sqlite3' && connection.connection.filename === ':memory:'
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
