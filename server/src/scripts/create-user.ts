import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { writeJson, readJson } from '../lib/storage.js'

async function main() {
  const email = process.argv[2]
  const password = process.argv[3]

  if (!email || !password) {
    console.error('Usage: tsx server/src/scripts/create-user.ts <email> <password>')
    process.exit(1)
  }

  const existing = await readJson<{ email: string } | null>('user.json', null)
  if (existing) {
    console.log(`User already exists: ${existing.email}`)
    console.log('Overwriting...')
  }

  const passwordHash = await bcrypt.hash(password, 10)
  await writeJson('user.json', { email, passwordHash })
  console.log(`User created: ${email}`)
}

main().catch(console.error)
