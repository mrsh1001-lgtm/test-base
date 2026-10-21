import { Link } from 'react-router-dom'
import { ArrowLeft, Download } from '../components/Icons'
import { PageHeader } from '../components/ui/Section'
import { brand } from '../data/brand'
import { downloads } from '../data/dealers'
import { usePageMeta } from '../lib/utils'

/** Qualitative manufacturer copy only — no certifications, figures or testimonials. */
const sections = [
  {
    title: 'شرکت',
    paragraphs: [
      'رنگ‌آرا بر رنگ‌های معماری تمرکز دارد: پوشش‌هایی که برای دیوار داخلی، نمای بیرونی و سطوح دکوراتیو طراحی می‌شوند. هدف ما این است که انتخاب رنگ برای یک فضا ساده‌تر و قابل پیش‌بینی‌تر شود.',
      'این متن جایگزین‌پذیر است و باید با معرفی رسمی شرکت تکمیل شود.',
    ],
  },
  {
    title: 'تولید',
    paragraphs: [
      'خط تولید، ظرفیت و استانداردهای تولید باید از سوی کارخانه اعلام شود. تا زمان دریافت این اطلاعات، هیچ عدد یا گواهی‌ای در سایت منتشر نمی‌شود.',
    ],
  },
  {
    title: 'کنترل کیفیت',
    paragraphs: [
      'نتایج آزمون‌های کنترل کیفیت هر بچ تولید، پس از دریافت مستندات رسمی، در همین بخش منتشر خواهد شد.',
    ],
  },
]

export function About() {
  usePageMeta(
    `درباره ${brand.name} | رنگ‌آرا`,
    'درباره رنگ‌آرا: رویکرد به رنگ‌های معماری، تولید و کنترل کیفیت، و فایل‌های قابل دریافت.',
  )

  return (
    <>
      <PageHeader
        eyebrow="درباره ما"
        title="رنگ، به‌عنوان بخشی از معماری"
        intro="ما رنگ را نه به‌عنوان یک کالای مصرفی، بلکه به‌عنوان لایه‌ای از معماری می‌بینیم که نور، بافت و مقیاس فضا را تغییر می‌دهد."
      />

      <div className="shell py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div className="overflow-hidden rounded-panel bg-sand">
            <img
              src="/img/hero-scene.jpg"
              alt="فضای داخلی آفتابی با قوس معماری و سطل رنگ رنگ‌آرا"
              width={860}
              height={516}
              className="h-[280px] w-full object-cover sm:h-[420px]"
            />
          </div>

          <div className="space-y-8">
            {sections.map((s) => (
              <section key={s.title}>
                <h2 className="text-[1.25rem] font-bold">{s.title}</h2>
                <div className="mt-2 space-y-2.5 text-[0.94rem] leading-[1.95] text-plum-soft">
                  {s.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-panel border border-plum/10 bg-white p-6">
            <h2 className="text-[1.15rem] font-bold">فایل‌های قابل دریافت</h2>
            <p className="mt-1.5 text-[0.86rem] text-plum-mute">
              فقط فایل‌هایی که واقعاً موجودند فعال می‌شوند؛ بقیه پس از دریافت از کارخانه اضافه می‌شوند.
            </p>
            <ul className="mt-4 space-y-3">
              {downloads.map((d) => (
                <li key={d.id} className="flex items-start justify-between gap-4 border-b border-plum/10 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-[0.92rem] font-semibold text-plum">{d.title}</p>
                    <p className="mt-0.5 text-[0.8rem] text-plum-mute">{d.description}</p>
                  </div>
                  {d.url ? (
                    <a href={d.url} download className="btn-ghost !min-h-[40px] shrink-0 text-[0.8rem]">
                      <Download className="h-4 w-4" />
                      دریافت
                    </a>
                  ) : (
                    <span className="shrink-0 rounded-full bg-plum/5 px-3 py-1.5 text-[0.72rem] text-plum/40">
                      در دسترس نیست
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-panel bg-violet p-6 text-cream">
            <h2 className="text-[1.15rem] font-bold text-white">رنگ برای پروژه‌تان لازم دارید؟</h2>
            <p className="mt-2 text-[0.9rem] leading-[1.9] text-cream/85">
              برای انتخاب رنگ، استعلام قیمت یا همکاری با ما در تماس باشید.
            </p>
            <Link to="/contact#form" className="btn mt-5 !min-h-[48px] bg-cream text-plum hover:bg-white">
              تماس با ما
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
