import { create } from '../../method/coll/create.js'

async function collCreate (schema) {
  const { getInfo } = this.bajoDb.helper
  const { instance } = getInfo(schema)
  await create.call(this, schema)

  function printCols (prefix) {
    let cols = [...schema.fullText.fields]
    if (prefix) cols = cols.map(c => `${prefix}.${c}`)
    return cols.join(', ')
  }

  if (schema.fullText.fields.length > 0) {
    const columns = schema.fullText.fields.join(', ')
    const stmtSchema = `
      CREATE VIRTUAL TABLE ${schema.collName}_fts USING fts5 (
        ${printCols()}, content = '${schema.collName}', content_rowid = 'id'
      );
    `
    const stmtTriggerInsert = `
      CREATE TRIGGER ${schema.collName}_fts_insert AFTER INSERT ON ${schema.collName}
      BEGIN
        INSERT INTO ${schema.collName}_fts (rowid, ${columns}) VALUES (new.id, ${printCols('new')});
      END;
    `
    const stmtTriggerDelete = `
      CREATE TRIGGER ${schema.collName}_fts_delete AFTER DELETE ON ${schema.collName}
      BEGIN
        INSERT INTO ${schema.collName}_fts (${schema.collName}_fts, rowid, ${columns}) VALUES ('delete', old.id, ${printCols('old')});
      END;
    `

    const stmtTriggerUpdate = `
      CREATE TRIGGER ${schema.collName}_fts_update AFTER UPDATE ON ${schema.collName}
      BEGIN
        INSERT INTO ${schema.collName}_fts (${schema.collName}_fts, rowid, ${columns}) VALUES ('delete', old.id, ${printCols('old')});
        INSERT INTO ${schema.collName}_fts (rowid, ${columns}) VALUES (new.id, ${printCols('new')});
      END;
    `
    await instance.client.raw(stmtSchema)
    await instance.client.raw(stmtTriggerInsert)
    await instance.client.raw(stmtTriggerDelete)
    await instance.client.raw(stmtTriggerUpdate)
  }
}

export default collCreate
