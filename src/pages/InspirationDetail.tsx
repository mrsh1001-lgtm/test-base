import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from '../components/Icons'
import { ProductCard } from '../components/ui/ProductCard'
import { NotFound } from './NotFound'
import { projectBySlug } from '../data/projects'
import { paletteBySlug, products, shadeBySlug } from '../data/catalog'
import { usePageMeta } from '../lib/utils'

export function InspirationDetail() {
  const { slug } = useParams()
  const project = projectBySlug(slug)

  usePageMeta(project ? `${project.title} | ایده و الهام رنگ‌آرا` : 'مورد یافت نشد', project?.summary)

  if (!project) return <NotFound />

  const palette = paletteBySlug(project.paletteSlug ?? '')
  const projectProducts = products.filter((p) => project.productSlugs.includes(p.slug))

  return (
    <>
      <div className="border-b border-plum/10 bg-cream-deep">
        <div className="shell flex flex-wrap items-center gap-2 py-4 text-[0.78rem] text-plum-mute">
          <Link to="/" className="hover:text-violet">
            خانه
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/inspiration" className="hover:text-violet">
            ایده و الهام
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-plum">{project.title}</span>
        </div>
      </div>

      <div className="shell py-10 lg:py-14">
        <p className="text-[0.8rem] text-plum-mute">
          {project.space} · {project.style}
          {project.colourStudy && <span className="mr-2 rounded-full bg-plum/5 px-2 py-0.5 text-[0.72rem]">مطالعه رنگ</span>}
        </p>
        <h1 className="mt-2 max-w-3xl text-display-lg">{project.title}</h1>
        <p className="mt-3 max-w-2xl text-[1rem] leading-[1.95] text-plum-soft">{project.summary}</p>

        <div className="mt-8 overflow-hidden rounded-panel bg-sand">
          <img
            src={project.image}
            alt={project.imageAlt}
            width={1200}
            height={720}
            className="h-[300px] w-full object-cover sm:h-[460px]"
          />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="space-y-4 text-[0.95rem] leading-[1.95] text-plum-soft">
            {project.body.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>

          <div className="space-y-5">
            {palette && (
              <div className="rounded-panel border border-plum/10 bg-white p-5">
                <p className="text-[0.82rem] font-semibold text-plum">پالت {palette.name}</p>
                <p className="mt-1.5 text-[0.82rem] leading-relaxed text-plum-mute">{palette.note}</p>
                <ul className="mt-3 flex gap-1.5">
                  {palette.colorSlugs.map((cs) => {
                    const s = shadeBySlug(cs)
                    return s ? (
                      <li key={cs} className="flex-1">
                        <Link to={`/colors/${s.slug}`} className="block" title={s.name}>
                          <span className="block h-14 rounded-xl ring-1 ring-plum/10" style={{ backgroundColor: s.hex }} />
                        </Link>
                      </li>
                    ) : null
                  })}
                </ul>
              </div>
            )}

            <div className="rounded-panel border border-plum/10 bg-cream p-5">
              <p className="text-[0.82rem] font-semibold text-plum">رنگ‌های این فضا</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {project.colorSlugs.map((cs) => {
                  const s = shadeBySlug(cs)
                  return s ? (
                    <li key={cs}>
                      <Link
                        to={`/colors/${s.slug}`}
                        className="flex items-center gap-2 rounded-full border border-plum/12 bg-white py-1 pl-3 pr-1 text-[0.78rem] text-plum-soft hover:border-plum/30"
                      >
                        <span className="h-4 w-4 rounded-full ring-1 ring-plum/15" style={{ backgroundColor: s.hex }} />
                        {s.name}
                      </Link>
                    </li>
                  ) : null
                })}
              </ul>
            </div>

            <Link to="/contact#form" className="btn-primary w-full">
              مشاوره برای فضای من
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {projectProducts.length > 0 && (
          <div className="mt-14">
            <h2 className="text-[1.25rem] font-bold">محصولات استفاده‌شده</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projectProducts.map((p) => (
                <ProductCard key={p.slug} product={p} compact />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
