import { Link } from 'react-router-dom'
import { ArrowLeft } from '../Icons'
import { Section } from '../ui/Section'
import { articles } from '../../data/articles'
import { faNum } from '../../lib/utils'

export function ArticlesTeaser() {
  const picks = articles.slice(0, 3)

  return (
    <Section
      tone="white"
      eyebrow="مقالات و آموزش"
      title="قبل از باز کردن قوطی رنگ"
      intro="انتخاب رنگ، آماده‌سازی سطح و انتخاب پرداخت؛ مطالبی که نتیجه کار را تعیین می‌کنند."
      action={
        <Link to="/articles" className="btn-ghost">
          همه مقالات
          <ArrowLeft className="h-4 w-4" />
        </Link>
      }
    >
      <div className="grid gap-5 md:grid-cols-3">
        {picks.map((article) => (
          <article key={article.slug} className="group flex flex-col">
            <Link to={`/articles/${article.slug}`} className="overflow-hidden rounded-card" tabIndex={-1} aria-hidden="true">
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
            <div className="mt-3 flex items-center gap-2 text-[0.72rem] text-plum-mute">
              <span className="rounded-full bg-cream px-2 py-0.5">{article.category}</span>
              <span>{faNum(article.readMinutes)} دقیقه مطالعه</span>
            </div>
            <h3 className="mt-2 text-[1.05rem] font-bold leading-snug">
              <Link to={`/articles/${article.slug}`} className="transition hover:text-violet">
                {article.title}
              </Link>
            </h3>
            <p className="mt-1.5 line-clamp-2 text-[0.85rem] leading-relaxed text-plum-mute">{article.excerpt}</p>
          </article>
        ))}
      </div>
    </Section>
  )
}
