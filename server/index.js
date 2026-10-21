import express from 'express'
import { z } from 'zod'
import { pool } from './db.js'

const app = express()
const PORT = Number(process.env.API_PORT ?? 8787)

app.disable('x-powered-by')
app.use(express.json({ limit: '32kb' }))

/**
 * Consultation payload. Messages are returned per field so the form can show
 * exactly what needs fixing instead of a single generic error.
 */
const consultationSchema = z.object({
  name: z.string().trim().min(2, 'نام را کامل وارد کنید.').max(120),
  phone: z
    .string()
    .trim()
    .regex(/^0?9\d{9}$/, 'شماره موبایل معتبر وارد کنید.'),
  city: z.string().trim().min(2, 'شهر را وارد کنید.').max(80),
  requestType: z.string().trim().min(2, 'نوع درخواست را انتخاب کنید.').max(80),
  message: z.string().trim().min(10, 'توضیح کوتاهی بنویسید (حداقل ۱۰ نویسه).').max(2000),
  relatedType: z.enum(['product', 'color']).nullish(),
  relatedSlug: z.string().trim().max(120).nullish(),
})

const REQUEST_TYPES = new Set([
  'مشاوره انتخاب رنگ',
  'استعلام قیمت',
  'پشتیبانی فنی',
  'همکاری و نمایندگی',
])

// Simple in-memory throttle: personal-data forms should not be scriptable freely.
const submissions = new Map()
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5

function throttled(ip) {
  const now = Date.now()
  const entry = submissions.get(ip) ?? { count: 0, start: now }
  if (now - entry.start > WINDOW_MS) {
    entry.count = 0
    entry.start = now
  }
  entry.count += 1
  submissions.set(ip, entry)
  return entry.count > MAX_PER_WINDOW
}

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ ok: true })
  } catch (error) {
    res.status(503).json({ ok: false, error: 'database unavailable' })
  }
})

app.post('/api/consultations', async (req, res) => {
  const ip = req.ip ?? 'unknown'
  if (throttled(ip)) {
    res.status(429).json({ ok: false, error: 'تعداد درخواست‌ها زیاد است. لطفاً کمی بعد دوباره تلاش کنید.' })
    return
  }

  const parsed = consultationSchema.safeParse(req.body ?? {})
  if (!parsed.success) {
    const errors = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (typeof key === 'string' && !errors[key]) errors[key] = issue.message
    }
    res.status(400).json({ ok: false, errors })
    return
  }

  const data = parsed.data
  if (!REQUEST_TYPES.has(data.requestType)) {
    res.status(400).json({ ok: false, errors: { requestType: 'نوع درخواست معتبر نیست.' } })
    return
  }

  try {
    const result = await pool.query(
      `INSERT INTO consultations (name, phone, city, request_type, message, related_type, related_slug)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        data.name,
        data.phone,
        data.city,
        data.requestType,
        data.message,
        data.relatedType ?? null,
        data.relatedSlug ?? null,
      ],
    )
    res.status(201).json({ ok: true, id: result.rows[0].id })
  } catch (error) {
    console.error('[consultations] insert failed:', error.message)
    res.status(500).json({ ok: false, error: 'ثبت درخواست انجام نشد. لطفاً دوباره تلاش کنید.' })
  }
})

app.use((_req, res) => {
  res.status(404).json({ ok: false, error: 'not found' })
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[api] listening on 0.0.0.0:${PORT}`)
})
