import { create } from '../../method/coll/create.js'

async function applyTable (schema, table) {
  for (const field of schema.fullText.fields ?? []) {
    const opts = { indexType: 'FULLTEXT' }
    table.index(field, null, opts)
  }
  if (schema.engine) table.engine(schema.engine)
}

async function collCreate (schema) {
  await create.call(this, schema, applyTable)
}

export default collCreate
