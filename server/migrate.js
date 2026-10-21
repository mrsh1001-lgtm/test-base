import { pool } from './db.js'

/**
 * Idempotent schema setup, run once per boot by the `migrate` compose service.
 * Consultation requests hold personal data: there is no public read path to
 * this table, only the INSERT performed by the site's form.
 */
const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS consultations (
     id            bigserial PRIMARY KEY,
     name          text        NOT NULL,
     phone         text        NOT NULL,
     city          text        NOT NULL,
     request_type  text        NOT NULL,
     message       text        NOT NULL,
     related_type  text,
     related_slug  text,
     created_at    timestamptz NOT NULL DEFAULT now()
   )`,
  `CREATE INDEX IF NOT EXISTS consultations_created_at_idx ON consultations (created_at DESC)`,
]

const run = async () => {
  const client = await pool.connect()
  try {
    for (const statement of STATEMENTS) {
      await client.query(statement)
    }
    console.log('[migrate] schema ready')
  } finally {
    client.release()
    await pool.end()
  }
}

run().catch((error) => {
  console.error('[migrate] failed:', error.message)
  process.exit(1)
})
