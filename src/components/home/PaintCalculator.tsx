import { useMemo, useState } from 'react'
import { Section } from '../ui/Section'
import { products } from '../../data/catalog'
import { faNum, faNumber } from '../../lib/utils'

/** Persian-digit packaging sizes ("۱۲") back to numbers for can estimation. */
function parseFaNumber(input: string): number {
  const fa = '۰۱۲۳۴۵۶۷۸۹'
  const normalized = input.replace(/[۰-۹]/g, (d) => String(fa.indexOf(d))).replace('٫', '.').replace('٣', '3')
  const n = Number(normalized)
  return Number.isFinite(n) ? n : 0
}

const productsWithCoverage = products.filter((p) => p.coverage)

export function PaintCalculator() {
  const [productSlug, setProductSlug] = useState(productsWithCoverage[0]?.slug ?? '')
  const product = productsWithCoverage.find((p) => p.slug === productSlug) ?? productsWithCoverage[0]

  const [area, setArea] = useState('48')
  const [coats, setCoats] = useState('2')
  const [coverage, setCoverage] = useState(String(product?.coverage?.value ?? ''))
  const [waste, setWaste] = useState('8')

  const onProductChange = (slug: string) => {
    setProductSlug(slug)
    const next = productsWithCoverage.find((p) => p.slug === slug)
    if (next?.coverage) setCoverage(String(next.coverage.value))
  }

  const result = useMemo(() => {
    const areaNum = Number(area)
    const coatsNum = Number(coats)
    const coverageNum = Number(coverage)
    const wasteNum = Number(waste)

    if (!Number.isFinite(areaNum) || areaNum <= 0) return { error: 'مساحت سطح را بزرگ‌تر از صفر وارد کنید.' }
    if (!Number.isFinite(coatsNum) || coatsNum < 1 || coatsNum > 5)
      return { error: 'تعداد لایه باید بین ۱ تا ۵ باشد.' }
    if (!Number.isFinite(coverageNum) || coverageNum <= 0)
      return { error: 'پوشش‌دهی هر لایه باید بزرگ‌تر از صفر باشد.' }
    if (!Number.isFinite(wasteNum) || wasteNum < 0 || wasteNum > 50)
      return { error: 'درصد پرت باید بین ۰ تا ۵۰ باشد.' }

    const liters = (areaNum * coatsNum * (1 + wasteNum / 100)) / coverageNum
    const rounded = Math.ceil(liters * 2) / 2

    // Can estimate straight from the manufacturer's packaging sizes.
    const canSizes = (product?.packaging ?? [])
      .map((p) => parseFaNumber(p.size))
      .filter((n) => n > 0)
      .sort((a, b) => b - a)
    const biggest = canSizes[0]
    const cans = biggest ? Math.ceil(rounded / biggest) : null

    return {
      liters: rounded,
      cans,
      canSize: biggest,
      unit: product?.coverage?.unit ?? 'متر مربع در هر لیتر',
      coverageNum,
      coatsNum,
      areaNum,
      wasteNum,
    }
  }, [area, coats, coverage, waste, product])

  const hasError = 'error' in result

  return (
    <Section
      id="calculator"
      eyebrow="محاسبه‌گر رنگ"
      title="چقدر رنگ لازم دارید؟"
      intro="مساحت، تعداد لایه و پوشش‌دهی محصول را وارد کنید. نتیجه یک برآورد است، نه سفارش قطعی."
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <form className="rounded-panel border border-plum/10 bg-white p-5 sm:p-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="calc-product" className="mb-1.5 block text-[0.82rem] font-medium text-plum">
              محصول
            </label>
            <select
              id="calc-product"
              value={productSlug}
              onChange={(e) => onProductChange(e.target.value)}
              className="field"
            >
              {productsWithCoverage.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="calc-area" className="mb-1.5 block text-[0.82rem] font-medium text-plum">
                مساحت سطح (متر مربع)
              </label>
              <input
                id="calc-area"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.5"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="field ltr text-right"
                dir="ltr"
                required
              />
            </div>
            <div>
              <label htmlFor="calc-coats" className="mb-1.5 block text-[0.82rem] font-medium text-plum">
                تعداد لایه
              </label>
              <input
                id="calc-coats"
                type="number"
                inputMode="numeric"
                min="1"
                max="5"
                step="1"
                value={coats}
                onChange={(e) => setCoats(e.target.value)}
                className="field ltr text-right"
                dir="ltr"
                required
              />
            </div>
            <div>
              <label htmlFor="calc-coverage" className="mb-1.5 block text-[0.82rem] font-medium text-plum">
                پوشش‌دهی هر لایه (متر مربع در لیتر)
              </label>
              <input
                id="calc-coverage"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.1"
                value={coverage}
                onChange={(e) => setCoverage(e.target.value)}
                className="field ltr text-right"
                dir="ltr"
                required
              />
              <p className="mt-1.5 text-[0.72rem] text-plum-mute">
                مقدار پیش‌فرض از داده محصول گرفته شده و قابل ویرایش است.
              </p>
            </div>
            <div>
              <label htmlFor="calc-waste" className="mb-1.5 block text-[0.82rem] font-medium text-plum">
                پرت (درصد)
              </label>
              <input
                id="calc-waste"
                type="number"
                inputMode="numeric"
                min="0"
                max="50"
                step="1"
                value={waste}
                onChange={(e) => setWaste(e.target.value)}
                className="field ltr text-right"
                dir="ltr"
              />
            </div>
          </div>
        </form>

        <div className="rounded-panel border border-plum/10 bg-plum p-6 text-cream">
          <p className="text-[0.8rem] text-cream/70">برآورد رنگ مورد نیاز</p>

          {hasError ? (
            <p role="alert" className="mt-3 rounded-2xl bg-coral/20 px-4 py-3 text-[0.85rem] text-white">
              {result.error}
            </p>
          ) : (
            <>
              <p className="mt-2 flex items-end gap-2">
                <span className="text-[2.6rem] font-bold leading-none">{faNumber(result.liters, 1)}</span>
                <span className="pb-1 text-[0.95rem] text-cream/80">لیتر</span>
              </p>

              {result.cans && result.canSize ? (
                <p className="mt-3 text-[0.88rem] text-cream/85">
                  معادل حدود {faNum(result.cans)} بسته {faNum(result.canSize)} لیتری از این محصول.
                </p>
              ) : null}

              <div className="mt-6 space-y-2 border-t border-cream/15 pt-4 text-[0.8rem] text-cream/70">
                <p>
                  فرمول: مساحت × تعداد لایه × (۱ + پرت) ÷ پوشش‌دهی
                </p>
                <p className="ltr text-right" dir="ltr">
                  {faNum(result.areaNum)} × {faNum(result.coatsNum)} × (1 + {faNum(result.wasteNum)}%) ÷{' '}
                  {faNum(result.coverageNum)} = {faNumber(result.liters, 1)} L
                </p>
                <p>واحد پوشش‌دهی: {result.unit}</p>
                <p>مقادیر بر اساس داده‌ی نمونه‌ی محصول محاسبه شده و برآوردی است.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </Section>
  )
}
