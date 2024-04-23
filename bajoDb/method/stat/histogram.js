async function histogram ({ schema, filter = {}, options = {} }) {
  const { importModule, currentLoc, fs } = this.bajo.helper
  const { getInfo } = this.bajoDb.helper
  const { driver } = getInfo(schema)
  let file = `${currentLoc(import.meta).dir}/../../lib/${driver.type}/stat-histogram-${options.type}.js`
  if (!fs.existsSync(file)) file = `${currentLoc(import.meta).dir}/histogram/${options.type}.js`
  const mod = await importModule(file)
  return await mod.call(this, { schema, filter, options })
}

export default histogram
