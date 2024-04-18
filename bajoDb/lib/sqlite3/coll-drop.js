async function collDrop (schema) {
  const { getInfo } = this.bajoDb.helper
  const { instance } = getInfo(schema)
  await instance.client.schema.dropTable(schema.collName)
  if (schema.fullText.fields.length > 0) {
    await instance.client.schema.dropTable(`${schema.collName}_fts`)
  }
}

export default collDrop
