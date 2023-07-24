import knex from 'knex'
import createTable from '../lib/create-table.js'

async function instancing ({ connection, schemas, noRebuild }) {
  const { importPkg, log, fatal, readJson, currentLoc } = this.bajo.helper
  const { merge, pick } = await importPkg('lodash-es')
  this.bajoDbKnex.instances = this.bajoDbKnex.instances || []
  const driverPkg = readJson(`${currentLoc(import.meta).dir}/../lib/driver-pkg.json`)
  const Dialect = (await import(`knex/lib/dialects/${connection.type}/index.js`)).default
  const driver = await importPkg(`app:${driverPkg[connection.type]}`)
  Dialect.prototype._driver = () => driver
  const instance = pick(connection, ['name', 'type', 'memory'])
  instance.client = knex(merge({}, connection, { log, client: Dialect }))
  this.bajoDbKnex.instances.push(instance)
  // make sure connection is established
  try {
    await instance.client.raw('SELECT 1')
    log.info('\'%s\' is connected', connection.name)
  } catch (err) {
    log.error('Error on \'%s\': %s', connection.name, err.message)
  }
  if (noRebuild) return
  for (const schema of schemas) {
    const exists = await instance.client.schema.hasTable(schema.collName)
    if (!exists || instance.memory) {
      try {
        await createTable.call(this, { schema, instance })
        log.trace('Model \'%s@%s\' successfully built on the fly', schema.name, connection.name)
      } catch (err) {
        fatal('Unable to build model \'%s@%s\': %s', schema.name, connection.name, err.message)
      }
    }
  }
}

export default instancing
