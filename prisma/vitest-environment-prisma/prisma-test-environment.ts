import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { URL } from 'node:url'
import { Environment } from 'vitest/environments'

const prisma = new PrismaClient()

function generateDatabaseUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',

  async setup() {
    const schema = randomUUID()
    const databaseURL = generateDatabaseUrl(schema)

    process.env.DATABASE_URL = databaseURL

    execSync('pnpm prisma migrate deploy')

    return {
      async teardown() {
        await prisma.$queryRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE;`,
        )
        await prisma.$disconnect()
      },
    }
  },
}
