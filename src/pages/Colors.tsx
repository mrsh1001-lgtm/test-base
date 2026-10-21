import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Search } from '../components/Icons'
import { PageHeader } from '../components/ui/Section'
import { colorFamilies, colorShades, palettes, shadeBySlug } from '../data/catalog'
import { useFavorites } from '../lib/favorites'
import { cn, faNum, usePageMeta } from '../lib/utils'

export function Colors() {
  const [query, setQuery] = useState('')
  const [family, setFamily] = useState('')
  const { favorites } = useFavorites()

  usePageMeta(
    'کتاب رنگ | رنگ‌آرا',
    'کتاب رنگ رنگ‌آرا: جستجوی رنگ بر اساس نام و کد، خانواده‌های رنگ و پالت‌های هماهنگ برای فضای داخلی و نما.',
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return colorShades.filter((c) => {
      if (family && c.familySlug !== family) return false
      if (!needle) return true
      return c.name.toLowerCase().includes(needle) || c.code.toLowerCase().includes(needle)
    })
  }, [query, family])

  const favoriteShades = favorites.map(shadeBySlug).filter(Boolean)

  return (
    <>
      <PageHeader
        eyebrow="دنیای رنگ‌ها"
        title="کتاب رنگ"
        intro="هر رنگ با نام و کد مشخص می‌شود. رنگ‌ها را جستجو کنید، در پالت‌های هماهنگ ببینید و برای بررسی بعدی ذخیره کنید."
      >
        <div className="flex max-w-md items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-plum/35" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="نام رنگ یا کد، مثلاً RA-1000"
              aria-label="جستجوی رنگ"
              className="field pr-9"
            />
          </div>
        </div>
      </PageHeader>

      <div className="shell py-10">
        {favoriteShades.length > 0 && (
          <div className="mb-8 rounded-panel border border-plum/10 bg-white p-4">
            <p className="flex items-center gap-2 text-[0.82rem] font-semibold text-plum">
              <Heart filled className="h-4 w-4 text-coral" />
              رنگ‌های ذخیره‌شده شما
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {favoriteShades.map((shade) =>
                shade ? (
                  <li key={shade.slug}>
                    <Link
                      to={`/colors/${shade.slug}`}
                      className="flex items-center gap-2 rounded-full border border-plum/12 py-1 pl-3 pr-1 text-[0.8rem] text-plum-soft hover:border-plum/30"
                    >
                      <span className="h-5 w-5 rounded-full ring-1 ring-plum/15" style={{ backgroundColor: shade.hex }} />
                      {shade.name}
                    </Link>
                  </li>
                ) : null,
              )}
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-2" role="group" aria-label="فیلتر خانواده رنگ">
          <button
            type="button"
            onClick={() => setFamily('')}
            aria-pressed={family === ''}
            className={cn('chip !min-h-[40px] text-[0.82rem]', family === '' && 'chip-active')}
          >
            همه خانواده‌ها
          </button>
          {colorFamilies.map((f) => (
            <button
              key={f.slug}
              type="button"
              onClick={() => setFamily(family === f.slug ? '' : f.slug)}
              aria-pressed={family === f.slug}
              className={cn('chip !min-h-[40px] text-[0.82rem]', family === f.slug && 'chip-active')}
            >
              {f.name}
            </button>
          ))}
        </div>

        <p className="mt-5 text-[0.84rem] text-plum-soft" aria-live="polite">
          {faNum(filtered.length)} رنگ
        </p>

        {filtered.length === 0 ? (
          <div className="mt-6 rounded-panel border border-dashed border-plum/20 bg-white/60 p-10 text-center">
            <p className="font-semibold text-plum">رنگی با این مشخصات پیدا نشد</p>
            <p className="mt-2 text-[0.86rem] text-plum-mute">جستجو یا فیلتر خانواده رنگ را تغییر دهید.</p>
            <button
              type="button"
              onClick={() => {
                setQuery('')
                setFamily('')
              }}
              className="btn-primary mt-5"
            >
              پاک کردن جستجو
            </button>
          </div>
        ) : (
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((shade) => (
              <li key={shade.slug}>
                <Link to={`/colors/${shade.slug}`} className="group block overflow-hidden rounded-card border border-plum/10 bg-white transition hover:shadow-soft">
                  <span
                    className="block h-[104px] w-full transition duration-500 group-hover:h-[112px]"
                    style={{ backgroundColor: shade.hex }}
                    aria-hidden="true"
                  />
                  <span className="block p-3">
                    <span className="block text-[0.86rem] font-semibold text-plum">{shade.name}</span>
                    <span className="mt-0.5 flex items-center justify-between text-[0.72rem] text-plum-mute">
                      <span className="ltr">{shade.code}</span>
                      <span className="ltr">{shade.hex}</span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <section id="palettes" className="mt-16 scroll-mt-28">
          <h2 className="text-[1.35rem] font-bold">پالت‌های هماهنگ</h2>
          <p className="mt-2 max-w-2xl text-[0.9rem] leading-relaxed text-plum-soft">
            هر پالت مجموعه‌ای از رنگ‌هایی است که در یک فضا کنار هم کار می‌کنند: یک تن روشن برای سطوح بزرگ، یک تن
            عمیق برای دیوار شاخص و یک لهجه.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {palettes.map((palette) => (
              <div key={palette.slug} className="rounded-panel border border-plum/10 bg-white p-5">
                <h3 className="text-[1rem] font-bold text-plum">{palette.name}</h3>
                <p className="mt-1.5 text-[0.85rem] leading-relaxed text-plum-mute">{palette.note}</p>
                <ul className="mt-4 flex gap-1.5">
                  {palette.colorSlugs.map((slug) => {
                    const shade = shadeBySlug(slug)
                    return shade ? (
                      <li key={slug} className="flex-1">
                        <Link to={`/colors/${shade.slug}`} className="block" title={shade.name}>
                          <span
                            className="block h-16 rounded-xl ring-1 ring-plum/10 transition hover:scale-[1.03]"
                            style={{ backgroundColor: shade.hex }}
                          />
                          <span className="mt-1.5 block truncate text-[0.7rem] text-plum-mute">{shade.name}</span>
                        </Link>
                      </li>
                    ) : null
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
