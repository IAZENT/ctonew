import path from 'path'
import { fileURLToPath } from 'url'

import * as Payload from 'payload'
import * as PostgresDB from '@payloadcms/db-postgres'
import * as Lexical from '@payloadcms/richtext-lexical'

import { Categories } from './payload/collections/Categories'
import { FormSubmissions } from './payload/collections/FormSubmissions'
import { Media } from './payload/collections/Media'
import { Pages } from './payload/collections/Pages'
import { Products } from './payload/collections/Products'
import { Users } from './payload/collections/Users'
import { Settings } from './payload/globals/Settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default (Payload as any).buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3001',
  editor: (Lexical as any).lexicalEditor?.({}) ?? undefined,
  db:
    (PostgresDB as any).postgresAdapter?.({
      pool: {
        connectionString: process.env.DATABASE_URL,
      },
    }) ?? undefined,
  collections: [Users, Products, Categories, Pages, FormSubmissions, Media],
  globals: [Settings],
  admin: {
    user: 'users',
  },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
} as any)
