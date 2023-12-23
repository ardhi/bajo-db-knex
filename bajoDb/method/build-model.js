import collCreate from './coll/create.js'
import collExists from './coll/exists.js'
import collDrop from './coll/drop.js'

async function buildModel ({ schema, instance, spin }) {
  const { getConfig } = this.bajo.helper
  const config = getConfig()
  if (await collExists.call(this, schema)) {
    if (config.force) {
      try {
        await collDrop.call(this, schema)
        spin.setText('Model \'%s\' successfully dropped', schema.name)
      } catch (err) {
        spin.fail('Error on dropping model \'%s\': %s', schema.name, err.message)
        return false
      }
    } else {
      spin.fail('Model \'%s\' exists. Won\'t rebuild without --force', schema.name)
      return false
    }
  }
  try {
    await collCreate.call(this, schema)
    spin.succeed('Model \'%s\' successfully created', schema.name)
    return true
  } catch (err) {
    spin.fail('Error on creating \'%s\': %s', schema.name, err.message)
    return false
  }
}

export default buildModel
