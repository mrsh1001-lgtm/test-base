import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Close, Filter, Search } from '../components/Icons'
import { PageHeader } from '../components/ui/Section'
import { ProductCard } from '../components/ui/ProductCard'
import { categories, products } from '../data/catalog'
import { cn, faNum, usePageMeta } from '../lib/utils'

const usageOptions = [
  { value: 'interior', label: 'فضای داخلی' },
  { value: 'exterior', label: 'نمای بیرونی' },
]

const finishOptions = Array.from(new Set(products.map((p) => p.finish)))
const surfaceOptions = Array.from(new Set(products.flatMap((p) => p.surfaces)))

export function Products() {
  const [params, setParams] = useSearchParams()
  const [drawerOpen, setDrawerOpen] = useState(false)

  usePageMeta(
    'محصولات | رنگ‌آرا',
    'فهرست رنگ‌های داخلی، رنگ‌های نما و پوشش‌های دکوراتیو رنگ‌آرا با فیلتر بر اساس کاربرد، سطح و پرداخت.',
  )

  const q = params.get('q') ?? ''
  const category = params.get('category') ?? ''
  const usage = params.get('usage') ?? ''
  const finish = params.get('finish') ?? ''
  const surface = params.get('surface') ?? ''

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const clearAll = () => setParams(new URLSearchParams(), { replace: true })

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return products.filter((p) => {
      if (category && p.categorySlug !== category) return false
      if (usage && p.usage !== usage) return false
      if (finish && p.finish !== finish) return false
      if (surface && !p.surfaces.includes(surface)) return false
      if (!needle) return true
      return [p.name, p.tagline, p.code, p.description.join(' '), ...p.surfaces, ...p.performance]
        .join(' ')
        .toLowerCase()
        .includes(needle)
    })
  }, [q, category, usage, finish, surface])

  const activeCount = [category, usage, finish, surface].filter(Boolean).length + (q ? 1 : 0)

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-[0.82rem] font-semibold text-plum">جستجو</p>
        <div className="relative">
          <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-plum/35" />
          <input
            type="search"
            value={q}
            onChange={(e) => setParam('q', e.target.value)}
            placeholder="نام محصول، کد یا سطح"
            aria-label="جستجوی محصول"
            className="field !min-h-[44px] pr-9 text-[0.86rem]"
          />
        </div>
      </div>

      <FilterGroup
        title="دسته‌بندی"
        value={category}
        onChange={(v) => setParam('category', v)}
        options={categories.map((c) => ({ value: c.slug, label: c.title }))}
      />
      <FilterGroup title="کاربرد" value={usage} onChange={(v) => setParam('usage', v)} options={usageOptions} />
      <FilterGroup
        title="پرداخت"
        value={finish}
        onChange={(v) => setParam('finish', v)}
        options={finishOptions.map((f) => ({ value: f, label: f }))}
      />
      <FilterGroup
        title="سطح قابل اجرا"
        value={surface}
        onChange={(v) => setParam('surface', v)}
        options={surfaceOptions.map((s) => ({ value: s, label: s }))}
      />

      {activeCount > 0 && (
        <button type="button" onClick={clearAll} className="btn-ghost w-full !min-h-[42px] text-[0.84rem]">
          پاک کردن فیلترها
        </button>
      )}
    </div>
  )

  return (
    <>
      <PageHeader
        eyebrow="محصولات"
        title="رنگ برای هر سطح، پوشش برای هر فضا"
        intro="سه خانواده محصول رنگ‌آرا: رنگ‌های داخلی، رنگ‌های نما و پوشش‌های دکوراتیو. با فیلترها محصول مناسب سطح خود را پیدا کنید."
      />

      <div className="shell py-10">
        <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28">{filterPanel}</div>
          </aside>

          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[0.85rem] text-plum-soft" aria-live="polite">
                {faNum(filtered.length)} محصول
                {activeCount > 0 && <span className="text-plum-mute"> · فیلتر فعال</span>}
              </p>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="btn-ghost !min-h-[44px] text-[0.85rem] lg:hidden"
              >
                <Filter className="h-4 w-4" />
                فیلترها
                {activeCount > 0 && (
                  <span className="rounded-full bg-violet px-2 text-[0.7rem] text-white">{faNum(activeCount)}</span>
                )}
              </button>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-panel border border-dashed border-plum/20 bg-white/60 p-10 text-center">
                <p className="text-[1rem] font-semibold text-plum">محصولی با این فیلترها پیدا نشد</p>
                <p className="mx-auto mt-2 max-w-md text-[0.86rem] leading-relaxed text-plum-mute">
                  فیلترها را ساده‌تر کنید یا جستجو را پاک کنید. اگر محصول مورد نظر را نمی‌شناسید، از راهنمای انتخاب
                  محصول استفاده کنید.
                </p>
                <button type="button" onClick={clearAll} className="btn-primary mt-5">
                  پاک کردن فیلترها
                </button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((p) => (
                  <ProductCard key={p.slug} product={p} compact />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            aria-label="بستن فیلترها"
            className="absolute inset-0 h-full w-full bg-plum/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="فیلتر محصولات"
            className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-panel bg-cream p-5 pb-8 shadow-lift"
          >
            <div className="mb-5 flex items-center justify-between">
              <p className="text-[1rem] font-bold text-plum">فیلترها</p>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="btn-ghost !min-h-[40px] !w-10 !px-0"
                aria-label="بستن"
              >
                <Close className="h-5 w-5" />
              </button>
            </div>
            {filterPanel}
            <button type="button" onClick={() => setDrawerOpen(false)} className="btn-primary mt-6 w-full">
              نمایش {faNum(filtered.length)} محصول
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function FilterGroup({
  title,
  value,
  onChange,
  options,
}: {
  title: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div>
      <p className="mb-2 text-[0.82rem] font-semibold text-plum">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => onChange('')}
          aria-pressed={value === ''}
          className={cn(
            'rounded-full border px-3 py-1.5 text-[0.78rem] transition',
            value === '' ? 'border-plum bg-plum text-cream' : 'border-plum/15 bg-white text-plum-soft hover:border-plum/30',
          )}
        >
          همه
        </button>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(value === opt.value ? '' : opt.value)}
            aria-pressed={value === opt.value}
            className={cn(
              'rounded-full border px-3 py-1.5 text-[0.78rem] transition',
              value === opt.value
                ? 'border-violet bg-violet text-white'
                : 'border-plum/15 bg-white text-plum-soft hover:border-plum/30',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}
