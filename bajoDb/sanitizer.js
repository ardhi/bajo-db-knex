async function sanitizer (conn) {
  const { importPkg, importModule, currentLoc } = this.bajo.helper
  const fs = await importPkg('fs-extra')
  const dir = currentLoc(import.meta).dir
  let file = `${dir}/sanitizer/${conn.type}.js`
  if (!fs.existsSync(file)) file = `${dir}/sanitizer/generic.js`
  const mod = await importModule(file)
  const result = await mod.call(this, conn)
  return result
}

export default sanitizer
