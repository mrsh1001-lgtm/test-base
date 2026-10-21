import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Heart } from '../components/Icons'
import { ProductCard } from '../components/ui/ProductCard'
import { NotFound } from './NotFound'
import { colorShades, productsForShade, shadeBySlug, familyBySlug, palettes } from '../data/catalog'
import { useFavorites } from '../lib/favorites'
import { cn, usePageMeta } from '../lib/utils'

export function ColorDetail() {
  const { slug } = useParams()
  const shade = shadeBySlug(slug)
  const { toggle, has } = useFavorites()

  usePageMeta(shade ? `${shade.name} ${shade.code} | کتاب رنگ رنگ‌آرا` : 'رنگ یافت نشد', shade?.hex)

  if (!shade) return <NotFound />

  const family = familyBySlug(shade.familySlug)
  const compatible = productsForShade(shade.slug)
  const saved = has(shade.slug)
  const siblings = colorShades.filter((c) => c.familySlug === shade.familySlug && c.slug !== shade.slug)
  const relatedPalettes = palettes.filter((p) => p.colorSlugs.includes(shade.slug))

  return (
    <>
      <div className="border-b border-plum/10 bg-cream-deep">
        <div className="shell flex flex-wrap items-center gap-2 py-4 text-[0.78rem] text-plum-mute">
          <Link to="/" className="hover:text-violet">
            خانه
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/colors" className="hover:text-violet">
            کتاب رنگ
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-plum">{shade.name}</span>
        </div>
      </div>

      <div className="shell py-10 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <div className="order-2 lg:order-1">
            <div
              className="h-[280px] w-full rounded-panel shadow-soft sm:h-[360px]"
              style={{ backgroundColor: shade.hex }}
              role="img"
              aria-label={`نمونه رنگ ${shade.name} با کد ${shade.hex}`}
            />
            <p className="mt-3 text-[0.72rem] leading-relaxed text-plum-mute">
              رنگ نمایشگر تقریبی است؛ انتخاب نهایی را با نمونه فیزیکی انجام دهید.
            </p>
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-[0.8rem] text-plum-mute">{family?.name}</p>
            <h1 className="mt-2 text-display-md">{shade.name}</h1>

            <dl className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-plum/10 bg-white p-4">
                <dt className="text-[0.72rem] text-plum-mute">کد رنگ</dt>
                <dd className="ltr mt-1 text-[1rem] font-semibold text-plum">{shade.code}</dd>
              </div>
              <div className="rounded-2xl border border-plum/10 bg-white p-4">
                <dt className="text-[0.72rem] text-plum-mute">کد HEX</dt>
                <dd className="ltr mt-1 text-[1rem] font-semibold text-plum">{shade.hex}</dd>
              </div>
            </dl>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => toggle(shade.slug)}
                aria-pressed={saved}
                className={cn('btn', saved ? 'bg-coral-soft text-plum' : 'btn-ghost')}
              >
                <Heart filled={saved} className={cn('h-4 w-4', saved && 'text-coral-deep')} />
                {saved ? 'در رنگ‌های ذخیره‌شده' : 'ذخیره این رنگ'}
              </button>
              <Link to={`/contact?color=${shade.slug}#form`} className="btn-primary">
                مشاوره درباره این رنگ
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </div>

            {family && <p className="mt-6 text-[0.9rem] leading-[1.9] text-plum-soft">{family.blurb}</p>}

            {relatedPalettes.length > 0 && (
              <div className="mt-6">
                <p className="text-[0.82rem] font-semibold text-plum">در این پالت‌ها استفاده می‌شود</p>
                <ul className="mt-2 space-y-2">
                  {relatedPalettes.map((p) => (
                    <li key={p.slug} className="rounded-2xl border border-plum/10 bg-white p-3">
                      <p className="text-[0.86rem] font-semibold text-plum">{p.name}</p>
                      <div className="mt-2 flex gap-1.5">
                        {p.colorSlugs.map((cs) => {
                          const s = shadeBySlug(cs)
                          return s ? (
                            <Link key={cs} to={`/colors/${s.slug}`} className="h-6 w-6 rounded-full ring-1 ring-plum/10" style={{ backgroundColor: s.hex }} title={s.name} />
                          ) : null
                        })}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-14">
          <h2 className="text-[1.25rem] font-bold">محصولات سازگار</h2>
          {compatible.length > 0 ? (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {compatible.map((p) => (
                <ProductCard key={p.slug} product={p} compact />
              ))}
            </div>
          ) : (
            <p className="mt-3 text-[0.88rem] text-plum-mute">برای این رنگ محصولی ثبت نشده است.</p>
          )}
        </div>

        {siblings.length > 0 && (
          <div className="mt-14">
            <h2 className="text-[1.25rem] font-bold">رنگ‌های هم‌خانواده</h2>
            <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {siblings.map((s) => (
                <li key={s.slug}>
                  <Link to={`/colors/${s.slug}`} className="block overflow-hidden rounded-card border border-plum/10 bg-white transition hover:shadow-soft">
                    <span className="block h-[76px] w-full" style={{ backgroundColor: s.hex }} aria-hidden="true" />
                    <span className="block p-2.5 text-[0.8rem] font-medium text-plum">{s.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  )
}
