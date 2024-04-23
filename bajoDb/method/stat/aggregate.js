async function aggregate ({ schema, filter = {}, options = {} }) {
  const { importModule, currentLoc, fs } = this.bajo.helper
  const { getInfo } = this.bajoDb.helper
  const { driver } = getInfo(schema)
  let file = `${currentLoc(import.meta).dir}/../../lib/${driver.type}/stat-aggregate-${options.aggregate}.js`
  if (!fs.existsSync(file)) file = `${currentLoc(import.meta).dir}/../../lib/${driver.aggregate}/_stat-aggregate-common.js`
  if (!fs.existsSync(file)) file = `${currentLoc(import.meta).dir}/aggregate/${options.aggregate}.js`
  if (!fs.existsSync(file)) file = `${currentLoc(import.meta).dir}/aggregate/_common.js`
  const mod = await importModule(file)
  return await mod.call(this, { schema, filter, options })
}

export default aggregate
