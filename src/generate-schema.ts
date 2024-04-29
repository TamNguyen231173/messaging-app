import { mergeTypeDefs } from '@graphql-tools/merge'
import { appendFile, readFileSync, writeFileSync } from 'fs'
import { unlink } from 'fs/promises'
import { sync as globSync } from 'glob'
import { print } from 'graphql'

async function mergeFiles(filePaths: string[]): Promise<string> {
  const typesArray: Array<string> = []

  for (const filePath of filePaths) {
    const schema = readFileSync(filePath, 'utf8')
    typesArray.push(schema)
  }

  return print(mergeTypeDefs(typesArray))
}

async function generateSchema() {
  const filePaths = globSync('src/**/*graphql')

  try {
    await unlink('schema.graphql')
  } catch (err: any) {
    if (err.code !== 'ENOENT') {
      throw err
    }
  }

  writeFileSync('schema.graphql', '# generated schema - do not edit #\n', { flag: 'a+' })

  const typeDefs = await mergeFiles(filePaths)

  appendFile('schema.graphql', typeDefs, (err) => {
    if (err) throw err
  })
}

generateSchema().catch(console.error)
