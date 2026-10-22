import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check } from '../Icons'
import { Section } from '../ui/Section'
import { products } from '../../data/catalog'
import type { Product } from '../../data/types'
import { cn } from '../../lib/utils'

interface Question {
  id: 'usage' | 'surface' | 'finish' | 'need'
  title: string
  hint: string
  options: string[]
}

const questions: Question[] = [
  {
    id: 'usage',
    title: 'کدام فضا را رنگ می‌کنید؟',
    hint: 'کاربرد، اولین فیلتر انتخاب محصول است.',
    options: ['فضای داخلی', 'نمای بیرونی'],
  },
  {
    id: 'surface',
    title: 'جنس سطح چیست؟',
    hint: 'سطح، تعیین می‌کند چه پوششی دوام می‌آورد.',
    options: ['گچ و بتونه', 'بتن', 'سیمان', 'رندر معدنی', 'آجر', 'MDF آماده‌شده'],
  },
  {
    id: 'finish',
    title: 'چه پرداخت نهایی می‌خواهید؟',
    hint: 'براقیت، ظاهر دیوار و شست‌وشوپذیری را تعیین می‌کند.',
    options: ['مات', 'نیمه‌مات', 'ابریشمی', 'بافت‌دار'],
  },
  {
    id: 'need',
    title: 'چه نیاز عملکردی مهم‌تر است؟',
    hint: 'اگر هیچ‌کدام را نمی‌خواهید، این مرحله را رد کنید.',
    options: ['قابل شست‌وشو', 'آبگریز', 'مقاومت در برابر اشعه فرابنفش', 'بافت طبیعی', 'پوشانندگی بالا'],
  },
]

type Answers = Partial<Record<Question['id'], string>>

interface Match {
  product: Product
  reasons: string[]
  score: number
}

/**
 * Recommendation engine. It only ever uses attributes stored on each product
 * record — no invented compatibility between a surface and a product line.
 */
function match(answers: Answers): Match[] {
  const usage = answers.usage === 'نمای بیرونی' ? 'exterior' : answers.usage ? 'interior' : null

  const scored = products.map<Match>((product) => {
    let score = 0
    const reasons: string[] = []

    if (usage) {
      if (product.usage !== usage && product.usage !== 'both') return { product, reasons, score: -1 }
      score += 4
      reasons.push(usage === 'exterior' ? 'برای نمای بیرونی' : 'برای فضای داخلی')
    }

    if (answers.surface) {
      if (product.surfaces.includes(answers.surface)) {
        score += 3
        reasons.push(`سازگار با ${answers.surface}`)
      }
    }

    if (answers.finish && product.finish === answers.finish) {
      score += 2
      reasons.push(`پرداخت ${product.finish}`)
    }

    if (answers.need && product.performance.includes(answers.need)) {
      score += 2
      reasons.push(product.performance.find((p) => p === answers.need) ?? '')
    }

    return { product, reasons: reasons.filter(Boolean), score }
  })

  return scored
    .filter((m) => m.score >= 4)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}

export function ProductFinder() {
  const [answers, setAnswers] = useState<Answers>({})
  const usable = match(answers)
  const answeredCount = Object.values(answers).filter(Boolean).length
  const ready = Boolean(answers.usage)

  return (
    <Section
      id="product-guide"
      tone="cream"
      eyebrow="راهنمای انتخاب محصول"
      title="از فضا به محصول برسید"
      intro="چهار پرسش کوتاه درباره فضا، سطح و پرداخت. پیشنهادها فقط از مشخصات ثبت‌شده‌ی هر محصول ساخته می‌شوند."
      action={
        answeredCount > 0 ? (
          <button type="button" onClick={() => setAnswers({})} className="btn-quiet text-[0.85rem]">
            پاک کردن انتخاب‌ها
          </button>
        ) : undefined
      }
    >
      <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-10">
        <div className="space-y-6">
          {questions.map((q, index) => (
            <fieldset key={q.id} className="rounded-card border border-plum/10 bg-white p-5">
              <legend className="flex items-center gap-2 px-1 text-[0.95rem] font-bold text-plum">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-plum/5 text-[0.72rem] text-plum-mute">
                  {index + 1}
                </span>
                {q.title}
              </legend>
              <p className="mt-1 text-[0.78rem] text-plum-mute">{q.hint}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {q.options.map((opt) => {
                  const selected = answers[q.id] === opt
                  return (
                    <button
                      key={opt}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: selected ? undefined : opt }))}
                      className={cn(
                        'inline-flex min-h-[40px] items-center gap-1.5 rounded-full border px-3.5 text-[0.82rem] transition',
                        selected
                          ? 'border-violet bg-violet text-white'
                          : 'border-plum/15 bg-white text-plum-soft hover:border-plum/30',
                      )}
                    >
                      {selected && <Check className="h-3.5 w-3.5" />}
                      {opt}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-panel border border-plum/10 bg-white p-5 shadow-soft">
            <p className="text-[0.8rem] font-semibold text-plum">پیشنهاد محصول</p>

            {!ready && (
              <p className="mt-3 text-[0.85rem] leading-relaxed text-plum-mute">
                برای دیدن پیشنهاد، ابتدا کاربرد فضا را انتخاب کنید.
              </p>
            )}

            {ready && usable.length === 0 && (
              <div className="mt-3">
                <p className="text-[0.85rem] leading-relaxed text-plum-soft">
                  با این ترکیب، محصولی با مشخصات ثبت‌شده پیدا نشد. برای انتخاب دقیق، از مشاوره فنی استفاده کنید.
                </p>
                <Link to="/contact#form" className="btn-primary mt-4 w-full">
                  درخواست مشاوره
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </div>
            )}

            {ready && usable.length > 0 && (
              <ul className="mt-3 space-y-3">
                {usable.map(({ product, reasons }) => (
                  <li key={product.slug} className="rounded-2xl border border-plum/10 p-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.imageAlt}
                        width={72}
                        height={72}
                        loading="lazy"
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                      <div className="min-w-0">
                        <Link to={`/products/${product.slug}`} className="block text-[0.92rem] font-bold text-plum hover:text-violet">
                          {product.name}
                        </Link>
                        <p className="mt-0.5 text-[0.72rem] text-plum-mute">{product.tagline}</p>
                      </div>
                    </div>
                    {reasons.length > 0 && (
                      <ul className="mt-2 flex flex-wrap gap-1.5">
                        {reasons.slice(0, 3).map((r) => (
                          <li key={r} className="rounded-full bg-cream px-2 py-0.5 text-[0.68rem] text-plum-soft">
                            {r}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-4 border-t border-plum/10 pt-3 text-[0.72rem] leading-relaxed text-plum-mute">
              پیشنهادها بر اساس ویژگی‌های ثبت‌شده‌ی محصولات است؛ انتخاب نهایی پس از بررسی سطح و نمونه رنگ انجام شود.
            </p>
          </div>
        </div>
      </div>
    </Section>
  )
}
