import pg from 'pg'

const { Pool } = pg

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error('[db] DATABASE_URL is not set')
}

/**
 * Local Postgres for this stack. Connection details are composed by the
 * environment's docker-compose file, never hard-coded.
 */
export const pool = new Pool({
  connectionString,
  max: 8,
  idleTimeoutMillis: 20_000,
  connectionTimeoutMillis: 8_000,
})

pool.on('error', (error) => {
  console.error('[db] idle client error', error.message)
})

export async function withClient(fn) {
  const client = await pool.connect()
  try {
    return await fn(client)
  } finally {
    client.release()
  }
}
