import { create } from '../../method/coll/create.js'

async function applyTable (schema, table) {
  for (const ft of schema.fullText ?? []) {
    for (const f of ft.fields ?? []) {
      table.specificType(f, 'tsvector')
      table.index(f, null, 'gin')
    }
  }
}

async function collCreate (schema) {
  await create.call(this.schema, applyTable)
}

export default collCreate
