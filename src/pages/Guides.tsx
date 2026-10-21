import { Link } from 'react-router-dom'
import { ArrowLeft } from '../components/Icons'
import { PageHeader } from '../components/ui/Section'
import { guides } from '../data/guides'
import { productBySlug } from '../data/catalog'
import { faNum, usePageMeta } from '../lib/utils'

export function Guides() {
  usePageMeta(
    'راهنمای اجرا | رنگ‌آرا',
    'راهنمای مرحله‌به‌مرحله آماده‌سازی سطح، اجرای رنگ نما، اجرای پوشش دکوراتیو و نگهداری دیوار رنگ‌شده.',
  )

  return (
    <>
      <PageHeader
        eyebrow="راهنمای اجرا"
        title="از آماده‌سازی تا لایه آخر"
        intro="ترتیب درست کار، بیشتر از انتخاب رنگ روی نتیجه اثر می‌گذارد. این راهنماها مرحله‌به‌مرحله نوشته شده‌اند."
      >
        <ul className="flex flex-wrap gap-2">
          {guides.map((g) => (
            <li key={g.slug}>
              <a href={`#${g.slug}`} className="chip !min-h-[40px] text-[0.82rem]">
                {g.title}
              </a>
            </li>
          ))}
        </ul>
      </PageHeader>

      <div className="shell space-y-10 py-10 lg:space-y-14">
        {guides.map((guide, index) => (
          <section key={guide.slug} id={guide.slug} className="scroll-mt-28 rounded-panel border border-plum/10 bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <p className="text-[0.75rem] text-plum-mute">راهنما {faNum(index + 1)}</p>
                <h2 className="mt-1 text-display-md">{guide.title}</h2>
                <p className="mt-2 text-[0.92rem] leading-[1.9] text-plum-soft">{guide.summary}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-[0.75rem]">
                <span className="rounded-full bg-cream px-3 py-1.5 text-plum-soft">زمان تقریبی: {guide.duration}</span>
              </div>
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
              <ol className="space-y-4">
                {guide.steps.map((step, i) => (
                  <li key={step.title} className="flex gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet/10 text-[0.78rem] font-bold text-violet">
                      {faNum(i + 1)}
                    </span>
                    <div>
                      <p className="text-[0.95rem] font-semibold text-plum">{step.title}</p>
                      <p className="mt-1 text-[0.87rem] leading-[1.9] text-plum-soft">{step.text}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="space-y-4">
                <div className="rounded-2xl bg-cream p-4">
                  <p className="text-[0.8rem] font-semibold text-plum">ابزار و مواد</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {guide.tools.map((tool) => (
                      <li key={tool} className="rounded-full bg-white px-2.5 py-1 text-[0.75rem] text-plum-soft">
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-plum/10 p-4">
                  <p className="text-[0.8rem] font-semibold text-plum">محصولات مرتبط</p>
                  <ul className="mt-2 space-y-1.5">
                    {guide.productSlugs.map((slug) => {
                      const product = productBySlug(slug)
                      return product ? (
                        <li key={slug}>
                          <Link to={`/products/${slug}`} className="text-[0.82rem] text-violet hover:text-violet-deep">
                            {product.name}
                          </Link>
                        </li>
                      ) : null
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        ))}

        <div className="rounded-panel bg-plum p-8 text-cream">
          <h2 className="text-display-md text-white">نتیجه دلخواه نگرفتید؟</h2>
          <p className="mt-2 max-w-xl text-[0.92rem] leading-[1.9] text-cream/80">
            مسئله سطح یا شرایط اجرا را برایمان بنویسید؛ راهنمایی فنی و پیشنهاد محصول دریافت می‌کنید.
          </p>
          <Link to="/contact#form" className="btn mt-5 !min-h-[48px] bg-cream text-plum hover:bg-white">
            درخواست مشاوره
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  )
}
