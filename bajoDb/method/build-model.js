import repoCreate from './repo/create.js'
import repoExists from './repo/exists.js'
import repoDrop from './repo/drop.js'

async function buildModel ({ schema, instance, spinner }) {
  const { getConfig } = this.bajo.helper
  const config = getConfig()
  if (await repoExists.call(this, schema)) {
    if (config.force) {
      try {
        await repoDrop.call(this, schema)
        spinner.setText('Model \'%s\' successfully dropped', schema.name)
      } catch (err) {
        spinner.fail('Error on dropping model \'%s\': %s', schema.name, err.message)
        return false
      }
    } else {
      spinner.fail('Model \'%s\' exists. Won\'t rebuild without --force', schema.name)
      return false
    }
  }
  try {
    await repoCreate.call(this, schema)
    spinner.succeed('Model \'%s\' successfully created', schema.name)
    return true
  } catch (err) {
    spinner.fail('Error on creating \'%s\': %s', schema.name, err.message)
    return false
  }
}

export default buildModel
