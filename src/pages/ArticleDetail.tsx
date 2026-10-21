import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from '../components/Icons'
import { NotFound } from './NotFound'
import { articleBySlug, articles } from '../data/articles'
import { faNum, usePageMeta } from '../lib/utils'

export function ArticleDetail() {
  const { slug } = useParams()
  const article = articleBySlug(slug)

  usePageMeta(article ? `${article.title} | رنگ‌آرا` : 'مقاله یافت نشد', article?.excerpt)

  if (!article) return <NotFound />

  const more = articles.filter((a) => a.slug !== article.slug).slice(0, 2)

  return (
    <>
      <div className="border-b border-plum/10 bg-cream-deep">
        <div className="shell flex flex-wrap items-center gap-2 py-4 text-[0.78rem] text-plum-mute">
          <Link to="/" className="hover:text-violet">
            خانه
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/articles" className="hover:text-violet">
            مقالات
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-plum">{article.title}</span>
        </div>
      </div>

      <article className="shell py-10 lg:py-14">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-2 text-[0.75rem] text-plum-mute">
            <span className="rounded-full bg-white px-2.5 py-1">{article.category}</span>
            <span>{faNum(article.readMinutes)} دقیقه مطالعه</span>
          </div>
          <h1 className="mt-3 text-display-lg text-balance">{article.title}</h1>
          <p className="mt-3 text-[1rem] leading-[1.95] text-plum-soft">{article.excerpt}</p>
        </div>

        <div className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-panel bg-sand">
          <img src={article.image} alt={article.imageAlt} width={1200} height={620} className="h-[260px] w-full object-cover sm:h-[380px]" />
        </div>

        <div className="mx-auto mt-10 max-w-3xl space-y-8">
          {article.body.map((section, i) => (
            <section key={i}>
              {section.heading && <h2 className="text-[1.25rem] font-bold">{section.heading}</h2>}
              <div className="mt-3 space-y-3 text-[0.97rem] leading-[2] text-plum-soft">
                {section.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              {section.list && section.list.length > 0 && (
                <ul className="mt-3 space-y-2 text-[0.94rem] leading-[1.95] text-plum-soft">
                  {section.list.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-turquoise" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <div className="rounded-panel border border-plum/10 bg-white p-5">
            <p className="text-[0.9rem] font-semibold text-plum">درباره رنگ خودت کمک می‌خواهی؟</p>
            <p className="mt-1.5 text-[0.85rem] leading-relaxed text-plum-mute">
              برای بررسی سطح، انتخاب تن نهایی و برآورد مقدار رنگ، درخواست مشاوره بگذارید.
            </p>
            <Link to="/contact#form" className="btn-primary mt-4">
              درخواست مشاوره
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {more.length > 0 && (
          <div className="mx-auto mt-14 max-w-3xl border-t border-plum/10 pt-8">
            <h2 className="text-[1.15rem] font-bold">مطالب بیشتر</h2>
            <ul className="mt-4 space-y-3">
              {more.map((a) => (
                <li key={a.slug}>
                  <Link to={`/articles/${a.slug}`} className="group flex items-center gap-4 rounded-2xl p-2 transition hover:bg-white">
                    <img src={a.image} alt="" width={120} height={80} loading="lazy" className="h-[64px] w-[96px] rounded-xl object-cover" />
                    <span>
                      <span className="block text-[0.95rem] font-semibold text-plum group-hover:text-violet">{a.title}</span>
                      <span className="mt-0.5 block text-[0.78rem] text-plum-mute">{a.category}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>
    </>
  )
}
