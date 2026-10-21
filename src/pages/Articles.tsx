import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui/Section'
import { articleCategories, articles } from '../data/articles'
import { cn, faNum, usePageMeta } from '../lib/utils'

export function Articles() {
  const [category, setCategory] = useState('')

  usePageMeta(
    'مقالات و آموزش | رنگ‌آرا',
    'مقالات رنگ‌آرا درباره انتخاب رنگ، آماده‌سازی سطح، پرداخت‌ها و نگهداری دیوار رنگ‌شده.',
  )

  const filtered = useMemo(
    () => articles.filter((a) => !category || a.category === category),
    [category],
  )

  return (
    <>
      <PageHeader
        eyebrow="مقالات و آموزش"
        title="دانش رنگ، قبل از خرید"
        intro="راهنماهای کوتاه و کاربردی برای انتخاب رنگ، آماده‌سازی سطح و نگهداری دیوار رنگ‌شده."
      >
        <div className="flex flex-wrap gap-2" role="group" aria-label="فیلتر دسته‌بندی مقاله">
          <button
            type="button"
            onClick={() => setCategory('')}
            aria-pressed={category === ''}
            className={cn('chip !min-h-[40px] text-[0.82rem]', category === '' && 'chip-active')}
          >
            همه
          </button>
          {articleCategories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={cn('chip !min-h-[40px] text-[0.82rem]', category === c && 'chip-active')}
            >
              {c}
            </button>
          ))}
        </div>
      </PageHeader>

      <div className="shell py-10">
        {filtered.length === 0 ? (
          <p className="rounded-panel border border-dashed border-plum/20 bg-white/60 p-8 text-center text-[0.9rem] text-plum-mute">
            در این دسته مقاله‌ای منتشر نشده است.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article) => (
              <article key={article.slug} className="group flex flex-col overflow-hidden rounded-panel border border-plum/10 bg-white transition hover:shadow-soft">
                <Link to={`/articles/${article.slug}`} tabIndex={-1} aria-hidden="true" className="overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.imageAlt}
                    width={520}
                    height={320}
                    loading="lazy"
                    decoding="async"
                    className="h-[200px] w-full object-cover transition duration-700 ease-soft group-hover:scale-[1.04]"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2 text-[0.72rem] text-plum-mute">
                    <span className="rounded-full bg-cream px-2 py-0.5">{article.category}</span>
                    <span>{faNum(article.readMinutes)} دقیقه مطالعه</span>
                  </div>
                  <h2 className="mt-2 text-[1.05rem] font-bold leading-snug">
                    <Link to={`/articles/${article.slug}`} className="transition hover:text-violet">
                      {article.title}
                    </Link>
                  </h2>
                  <p className="mt-1.5 line-clamp-3 text-[0.85rem] leading-relaxed text-plum-mute">{article.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
