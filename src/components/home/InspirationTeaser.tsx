import { Link } from 'react-router-dom'
import { ArrowLeft } from '../Icons'
import { paletteBySlug, projects } from '../../data/projects'
import { shadeBySlug } from '../../data/catalog'
import { Section } from '../ui/Section'

export function InspirationTeaser() {
  const picks = projects.slice(0, 3)
  const [lead, ...rest] = picks

  return (
    <Section
      eyebrow="ایده و الهام"
      title="رنگ در فضای واقعی"
      intro="ترکیب‌های آماده برای الهام گرفتن: هر پروژه با پالت رنگ و محصولات همان فضا."
      action={
        <Link to="/inspiration" className="btn-ghost">
          همه ایده‌ها
          <ArrowLeft className="h-4 w-4" />
        </Link>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        {lead && (
          <Link to={`/inspiration/${lead.slug}`} className="group relative overflow-hidden rounded-panel bg-sand">
            <img
              src={lead.image}
              alt={lead.imageAlt}
              width={860}
              height={560}
              loading="lazy"
              decoding="async"
              className="h-[300px] w-full object-cover transition duration-[900ms] ease-soft group-hover:scale-[1.03] sm:h-[420px]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-plum/85 via-plum/45 to-transparent p-6 pt-16">
              <p className="text-[0.75rem] text-cream/80">
                {lead.space} · {lead.style}
              </p>
              <h3 className="mt-1 text-[1.3rem] font-bold text-white">{lead.title}</h3>
              <div className="mt-3 flex items-center gap-1.5">
                {lead.colorSlugs.map((slug) => {
                  const shade = shadeBySlug(slug)
                  return shade ? (
                    <span
                      key={slug}
                      className="h-5 w-5 rounded-full ring-1 ring-white/40"
                      style={{ backgroundColor: shade.hex }}
                      title={shade.name}
                    />
                  ) : null
                })}
                <span className="mr-2 inline-flex items-center gap-1 text-[0.8rem] font-medium text-white">
                  دیدن پالت
                  <ArrowLeft className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          {rest.map((project) => (
            <Link
              key={project.slug}
              to={`/inspiration/${project.slug}`}
              className="group flex items-center gap-4 rounded-card border border-plum/10 bg-white p-3 transition hover:shadow-soft"
            >
              <img
                src={project.image}
                alt={project.imageAlt}
                width={220}
                height={160}
                loading="lazy"
                decoding="async"
                className="h-[104px] w-[132px] shrink-0 rounded-xl object-cover"
              />
              <div className="min-w-0">
                <p className="text-[0.72rem] text-plum-mute">{project.space}</p>
                <h3 className="mt-0.5 text-[1rem] font-bold text-plum group-hover:text-violet">{project.title}</h3>
                <p className="mt-1 line-clamp-2 text-[0.78rem] leading-relaxed text-plum-mute">{project.summary}</p>
                {paletteBySlug(project.paletteSlug ?? '') && (
                  <p className="mt-1.5 text-[0.72rem] text-violet">
                    پالت: {paletteBySlug(project.paletteSlug ?? '')?.name}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Section>
  )
}
