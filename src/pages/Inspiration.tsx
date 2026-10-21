import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from '../components/Icons'
import { PageHeader } from '../components/ui/Section'
import { projectSpaces, projectStyles, projects } from '../data/projects'
import { shadeBySlug } from '../data/catalog'
import { cn, faNum, usePageMeta } from '../lib/utils'

export function Inspiration() {
  const [space, setSpace] = useState('')
  const [style, setStyle] = useState('')

  usePageMeta(
    'ایده و الهام | رنگ‌آرا',
    'گالری الهام رنگ‌آرا: فضاهای داخلی و نما با پالت رنگ و محصولات مرتبط، فیلتر بر اساس نوع فضا و سبک.',
  )

  const filtered = useMemo(
    () => projects.filter((p) => (!space || p.space === space) && (!style || p.style === style)),
    [space, style],
  )

  return (
    <>
      <PageHeader
        eyebrow="ایده و الهام"
        title="رنگ، در مقیاس یک فضا"
        intro="ترکیب‌های آماده برای الهام گرفتن. هر پروژه با پالت رنگ و محصولات همان فضا همراه است."
      />

      <div className="shell py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="فیلتر نوع فضا">
            <button type="button" onClick={() => setSpace('')} aria-pressed={space === ''} className={cn('chip !min-h-[40px] text-[0.82rem]', space === '' && 'chip-active')}>
              همه فضاها
            </button>
            {projectSpaces.map((s) => (
              <button key={s} type="button" onClick={() => setSpace(s)} aria-pressed={space === s} className={cn('chip !min-h-[40px] text-[0.82rem]', space === s && 'chip-active')}>
                {s}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="فیلتر سبک">
            <button type="button" onClick={() => setStyle('')} aria-pressed={style === ''} className={cn('chip !min-h-[40px] text-[0.82rem]', style === '' && 'chip-active')}>
              همه سبک‌ها
            </button>
            {projectStyles.map((s) => (
              <button key={s} type="button" onClick={() => setStyle(s)} aria-pressed={style === s} className={cn('chip !min-h-[40px] text-[0.82rem]', style === s && 'chip-active')}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-5 text-[0.84rem] text-plum-soft" aria-live="polite">
          {faNum(filtered.length)} مورد
        </p>

        {filtered.length === 0 ? (
          <div className="mt-6 rounded-panel border border-dashed border-plum/20 bg-white/60 p-10 text-center">
            <p className="font-semibold text-plum">با این فیلترها موردی پیدا نشد</p>
            <button
              type="button"
              onClick={() => {
                setSpace('')
                setStyle('')
              }}
              className="btn-primary mt-5"
            >
              پاک کردن فیلترها
            </button>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {filtered.map((project, index) => (
              <Link
                key={project.slug}
                to={`/inspiration/${project.slug}`}
                className={cn(
                  'group overflow-hidden rounded-panel border border-plum/10 bg-white transition hover:shadow-lift',
                  index === 0 && 'md:col-span-2',
                )}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.imageAlt}
                    width={860}
                    height={520}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    className={cn(
                      'w-full object-cover transition duration-[900ms] ease-soft group-hover:scale-[1.03]',
                      index === 0 ? 'h-[300px] sm:h-[420px]' : 'h-[230px] sm:h-[260px]',
                    )}
                  />
                  {project.colourStudy && (
                    <span className="absolute right-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-[0.72rem] font-medium text-plum">
                      مطالعه رنگ
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 p-5">
                  <div>
                    <p className="text-[0.74rem] text-plum-mute">
                      {project.space} · {project.style}
                    </p>
                    <h2 className="mt-1 text-[1.15rem] font-bold text-plum group-hover:text-violet">{project.title}</h2>
                    <p className="mt-1.5 max-w-2xl text-[0.85rem] leading-relaxed text-plum-mute">{project.summary}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="flex gap-1">
                      {project.colorSlugs.slice(0, 4).map((cs) => {
                        const s = shadeBySlug(cs)
                        return s ? (
                          <span key={cs} className="h-5 w-5 rounded-full ring-1 ring-plum/15" style={{ backgroundColor: s.hex }} title={s.name} />
                        ) : null
                      })}
                    </span>
                    <ArrowLeft className="h-5 w-5 text-plum/30 transition group-hover:text-violet" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
