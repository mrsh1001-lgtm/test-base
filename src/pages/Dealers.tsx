import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Phone } from '../components/Icons'
import { PageHeader } from '../components/ui/Section'
import { Notice } from '../components/ui/SampleBadge'
import { dealerProvinces, dealers } from '../data/dealers'
import { cn, faNum, usePageMeta } from '../lib/utils'

export function Dealers() {
  const [province, setProvince] = useState('')
  const [city, setCity] = useState('')

  usePageMeta(
    'نمایندگی‌ها | رنگ‌آرا',
    'فهرست نمایندگی‌های فروش و مراکز پخش رنگ‌آرا به تفکیک استان و شهر.',
  )

  const cities = useMemo(
    () => Array.from(new Set(dealers.filter((d) => !province || d.province === province).map((d) => d.city))),
    [province],
  )

  const filtered = useMemo(
    () => dealers.filter((d) => (!province || d.province === province) && (!city || d.city === city)),
    [province, city],
  )

  return (
    <>
      <PageHeader
        eyebrow="نمایندگی‌ها"
        title="نزدیک‌ترین نمایندگی رنگ‌آرا"
        intro="فهرست نمایندگی‌ها را بر اساس استان و شهر فیلتر کنید. برای انتخاب رنگ و استعلام موجودی، پیش از مراجعه تماس بگیرید."
      />

      <div className="shell py-10">
        <Notice>
          فهرست زیر نمونه است و اطلاعات واقعی نمایندگی‌ها بارگذاری نشده است. نقشه نیز تنها در صورت اتصال سرویس نقشه
          نمایش داده می‌شود؛ تا آن زمان این فهرست مرجع است.
        </Notice>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="sm:w-64">
            <label htmlFor="province" className="mb-1.5 block text-[0.82rem] font-medium text-plum">
              استان
            </label>
            <select
              id="province"
              value={province}
              onChange={(e) => {
                setProvince(e.target.value)
                setCity('')
              }}
              className="field"
            >
              <option value="">همه استان‌ها</option>
              {dealerProvinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:w-64">
            <label htmlFor="city" className="mb-1.5 block text-[0.82rem] font-medium text-plum">
              شهر
            </label>
            <select id="city" value={city} onChange={(e) => setCity(e.target.value)} className="field">
              <option value="">همه شهرها</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {(province || city) && (
            <button
              type="button"
              onClick={() => {
                setProvince('')
                setCity('')
              }}
              className="btn-quiet sm:mb-0.5"
            >
              پاک کردن فیلترها
            </button>
          )}
        </div>

        <p className="mt-6 text-[0.84rem] text-plum-soft" aria-live="polite">
          {faNum(filtered.length)} نمایندگی
        </p>

        {filtered.length === 0 ? (
          <div className="mt-5 rounded-panel border border-dashed border-plum/20 bg-white/60 p-10 text-center">
            <p className="font-semibold text-plum">در این شهر نمایندگی ثبت نشده است</p>
            <p className="mt-2 text-[0.86rem] text-plum-mute">استان دیگری را انتخاب کنید یا برای راهنمایی تماس بگیرید.</p>
            <Link to="/contact#form" className="btn-primary mt-5">
              درخواست راهنمایی
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <ul className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((dealer) => (
              <li key={dealer.id} className="rounded-card border border-plum/10 bg-white p-5">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-[1rem] font-bold text-plum">{dealer.name}</h2>
                  <span className="rounded-full bg-cream px-2 py-0.5 text-[0.7rem] text-plum-soft">{dealer.kind}</span>
                </div>
                <p className="mt-2 flex items-start gap-2 text-[0.84rem] leading-relaxed text-plum-soft">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-violet" />
                  <span>
                    {dealer.province}، {dealer.city} — {dealer.address}
                  </span>
                </p>
                <p className="mt-1.5 flex items-center gap-2 text-[0.84rem] text-plum-soft">
                  <Phone className="h-4 w-4 shrink-0 text-violet" />
                  <span className="ltr" dir="ltr">
                    {dealer.phone}
                  </span>
                </p>
                <p className={cn('mt-3 text-[0.7rem]', dealer.sample ? 'text-plum/35' : 'hidden')}>
                  اطلاعات نمونه — جایگزین شود
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
