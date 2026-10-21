import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowLeft, Check, Mail, MapPin, Phone } from '../components/Icons'
import { PageHeader } from '../components/ui/Section'
import { brand } from '../data/brand'
import { colorShades, products, shadeBySlug, productBySlug } from '../data/catalog'
import { cn, faNum, usePageMeta } from '../lib/utils'

const REQUEST_TYPES = ['مشاوره انتخاب رنگ', 'استعلام قیمت', 'پشتیبانی فنی', 'همکاری و نمایندگی'] as const

type FieldName = 'name' | 'phone' | 'city' | 'requestType' | 'message'
type Values = Record<FieldName, string>
type Errors = Partial<Record<FieldName, string>>
type Status = 'idle' | 'submitting' | 'success' | 'error'

const EMPTY: Values = { name: '', phone: '', city: '', requestType: '', message: '' }

/** Persian/Arabic digits → Latin so the phone check accepts both. */
function normalizeDigits(input: string): string {
  const fa = '۰۱۲۳۴۵۶۷۸۹'
  const ar = '٠١٢٣٤٥٦٧٨٩'
  return input
    .replace(/[۰-۹]/g, (d) => String(fa.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(ar.indexOf(d)))
}

function validate(values: Values): Errors {
  const errors: Errors = {}
  if (values.name.trim().length < 2) errors.name = 'نام را کامل وارد کنید.'
  const phone = normalizeDigits(values.phone).replace(/[\s-]/g, '')
  if (!/^0?9\d{9}$/.test(phone)) errors.phone = 'شماره موبایل معتبر وارد کنید (مثلاً ۰۹۱۲۱۲۳۴۵۶۷).'
  if (values.city.trim().length < 2) errors.city = 'شهر را وارد کنید.'
  if (!values.requestType) errors.requestType = 'نوع درخواست را انتخاب کنید.'
  if (values.message.trim().length < 10) errors.message = 'توضیح کوتاهی بنویسید (حداقل ۱۰ نویسه).'
  return errors
}

export function Contact() {
  const [params] = useSearchParams()
  const relatedProduct = productBySlug(params.get('product') ?? '')
  const relatedColor = shadeBySlug(params.get('color') ?? '')

  usePageMeta(
    'تماس و مشاوره | رنگ‌آرا',
    'درخواست مشاوره رنگ، استعلام قیمت و راهنمایی فنی از رنگ‌آرا. فرم درخواست، اطلاعات تماس و ساعات کاری.',
  )

  const [values, setValues] = useState<Values>(EMPTY)
  const [related, setRelated] = useState(
    relatedProduct ? `product:${relatedProduct.slug}` : relatedColor ? `color:${relatedColor.slug}` : '',
  )
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [serverError, setServerError] = useState('')
  const [reference, setReference] = useState<number | null>(null)

  const relatedOptions = useMemo(
    () => [
      { value: '', label: 'مرتبط با محصول یا رنگ خاصی نیست' },
      ...products.map((p) => ({ value: `product:${p.slug}`, label: `محصول: ${p.name}` })),
      ...colorShades.map((c) => ({ value: `color:${c.slug}`, label: `رنگ: ${c.name} (${c.code})` })),
    ],
    [],
  )

  const update = (field: FieldName, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus('submitting')
    setServerError('')

    const [relatedType, relatedSlug] = related ? related.split(':') : ['', '']

    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          phone: normalizeDigits(values.phone).replace(/[\s-]/g, ''),
          relatedType: relatedType || null,
          relatedSlug: relatedSlug || null,
        }),
      })

      const payload: unknown = await response.json().catch(() => null)

      if (!response.ok) {
        const data = payload as { errors?: Errors; error?: string } | null
        if (data?.errors) setErrors(data.errors)
        setServerError(data?.error ?? 'ارسال درخواست انجام نشد. لطفاً دوباره تلاش کنید.')
        setStatus('error')
        return
      }

      const data = payload as { id?: number } | null
      setReference(typeof data?.id === 'number' ? data.id : null)
      setStatus('success')
      setValues(EMPTY)
      setRelated('')
    } catch {
      setServerError('ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی و دوباره تلاش کنید.')
      setStatus('error')
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="تماس و مشاوره"
        title="رنگ را با هم انتخاب کنیم"
        intro="فرم زیر برای مشاوره رنگ، استعلام قیمت و پشتیبانی فنی است. درخواست شما در سیستم ثبت می‌شود و برای پیگیری شماره ارجاع می‌گیرید."
      />

      <div className="shell py-10 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
          <div id="form" className="scroll-mt-28">
            {status === 'success' ? (
              <div className="rounded-panel border border-turquoise/40 bg-turquoise-soft/50 p-8 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-turquoise text-white">
                  <Check className="h-7 w-7" />
                </span>
                <h2 className="mt-4 text-[1.3rem] font-bold">درخواست شما ثبت شد</h2>
                <p className="mx-auto mt-2 max-w-md text-[0.9rem] leading-relaxed text-plum-soft">
                  درخواست در سیستم ثبت شد و کارشناسان ما برای پیگیری تماس می‌گیرند.
                  {reference !== null && (
                    <>
                      {' '}
                      شماره ارجاع: <span className="ltr font-semibold">{faNum(reference)}</span>
                    </>
                  )}
                </p>
                <button type="button" onClick={() => setStatus('idle')} className="btn-primary mt-6">
                  ارسال درخواست دیگر
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="rounded-panel border border-plum/10 bg-white p-6 sm:p-8">
                {(relatedProduct || relatedColor) && (
                  <p className="mb-5 rounded-2xl bg-violet-soft px-4 py-3 text-[0.82rem] text-violet-deep">
                    این درخواست به {relatedProduct ? `محصول «${relatedProduct.name}»` : `رنگ «${relatedColor?.name}»`} مرتبط
                    می‌شود.
                  </p>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id="name" label="نام و نام خانوادگی" error={errors.name}>
                    <input
                      id="name"
                      name="name"
                      value={values.name}
                      onChange={(e) => update('name', e.target.value)}
                      className={cn('field', errors.name && 'border-coral')}
                      aria-invalid={Boolean(errors.name)}
                      autoComplete="name"
                      required
                    />
                  </Field>

                  <Field id="phone" label="شماره موبایل" error={errors.phone} hint="برای پیگیری درخواست">
                    <input
                      id="phone"
                      name="phone"
                      value={values.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      className={cn('field ltr text-right', errors.phone && 'border-coral')}
                      dir="ltr"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="09121234567"
                      aria-invalid={Boolean(errors.phone)}
                      required
                    />
                  </Field>

                  <Field id="city" label="شهر" error={errors.city}>
                    <input
                      id="city"
                      name="city"
                      value={values.city}
                      onChange={(e) => update('city', e.target.value)}
                      className={cn('field', errors.city && 'border-coral')}
                      aria-invalid={Boolean(errors.city)}
                      autoComplete="address-level2"
                      required
                    />
                  </Field>

                  <Field id="requestType" label="نوع درخواست" error={errors.requestType}>
                    <select
                      id="requestType"
                      name="requestType"
                      value={values.requestType}
                      onChange={(e) => update('requestType', e.target.value)}
                      className={cn('field', errors.requestType && 'border-coral')}
                      aria-invalid={Boolean(errors.requestType)}
                      required
                    >
                      <option value="">انتخاب کنید…</option>
                      {REQUEST_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                <div className="mt-4">
                  <label htmlFor="related" className="mb-1.5 block text-[0.82rem] font-medium text-plum">
                    محصول یا رنگ مرتبط (اختیاری)
                  </label>
                  <select id="related" name="related" value={related} onChange={(e) => setRelated(e.target.value)} className="field">
                    {relatedOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-4">
                  <Field id="message" label="توضیح درخواست" error={errors.message}>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={values.message}
                      onChange={(e) => update('message', e.target.value)}
                      className={cn('field resize-y', errors.message && 'border-coral')}
                      placeholder="مثلاً: ۶۰ متر دیوار گچی در نشیمن، رنگ روشن مات می‌خواهم."
                      aria-invalid={Boolean(errors.message)}
                      required
                    />
                  </Field>
                </div>

                {status === 'error' && serverError && (
                  <p role="alert" className="mt-4 rounded-2xl bg-coral-soft px-4 py-3 text-[0.85rem] text-plum">
                    {serverError}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button type="submit" disabled={status === 'submitting'} className="btn-primary !min-h-[50px] disabled:opacity-60">
                    {status === 'submitting' ? 'در حال ارسال…' : 'ارسال درخواست'}
                    {status !== 'submitting' && <ArrowLeft className="h-4 w-4" />}
                  </button>
                  <p className="text-[0.75rem] text-plum-mute">
                    شماره شما فقط برای پیگیری همین درخواست استفاده می‌شود و عمومی نیست.
                  </p>
                </div>
              </form>
            )}
          </div>

          <aside className="space-y-5">
            <div className="rounded-panel border border-plum/10 bg-cream p-6">
              <h2 className="text-[1.05rem] font-bold">اطلاعات تماس</h2>
              <ul className="mt-4 space-y-3 text-[0.88rem] text-plum-soft">
                <li className="flex items-start gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-violet" />
                  <span className="ltr" dir="ltr">
                    {brand.phone}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-violet" />
                  <span className="ltr" dir="ltr">
                    {brand.email}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-violet" />
                  <span>{brand.address}</span>
                </li>
              </ul>
              <p className="mt-4 border-t border-plum/10 pt-3 text-[0.8rem] text-plum-mute">{brand.workingHours}</p>
              <p className="mt-2 text-[0.72rem] leading-relaxed text-plum/40">
                اطلاعات تماس بالا نمونه است و باید با شماره و نشانی واقعی جایگزین شود.
              </p>
            </div>

            <div className="rounded-panel border border-plum/10 bg-white p-6">
              <h2 className="text-[1.05rem] font-bold">پیش از تماس</h2>
              <ul className="mt-3 space-y-2 text-[0.84rem] leading-relaxed text-plum-soft">
                <li>مساحت تقریبی سطح و جنس آن را بدانید.</li>
                <li>اگر رنگ انتخابی دارید، کد آن را همراه داشته باشید.</li>
                <li>برای نما، جهت و میزان تابش آفتاب مهم است.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string
  label: string
  error?: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[0.82rem] font-medium text-plum">
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="mt-1 text-[0.75rem] text-coral-deep">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-[0.72rem] text-plum-mute">{hint}</p>
      ) : null}
    </div>
  )
}
