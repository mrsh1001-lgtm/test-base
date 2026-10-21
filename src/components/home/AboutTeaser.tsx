import { Link } from 'react-router-dom'
import { ArrowLeft } from '../Icons'
import { Section } from '../ui/Section'
import { brand } from '../../data/brand'

/**
 * Manufacturer introduction. Copy is deliberately qualitative: no
 * certifications, production figures, years of experience or testimonials are
 * claimed until the factory supplies them.
 */
const pillars = [
  {
    title: 'شرکت',
    text: 'رنگ‌آرا روی رنگ‌های معماری تمرکز دارد: پوشش‌هایی که برای دیوار، نما و سطوح دکوراتیو طراحی می‌شوند.',
    tone: 'bg-coral-soft',
  },
  {
    title: 'تولید',
    text: 'فرآیند تولید و مشخصات هر محصول باید از سوی کارخانه تکمیل و تأیید شود؛ داده‌های این سایت تا آن زمان نمونه است.',
    tone: 'bg-turquoise-soft',
  },
  {
    title: 'کنترل کیفیت',
    text: 'کنترل کیفیت و آزمون‌های هر بچ تولید، پس از دریافت مستندات رسمی در همین بخش منتشر می‌شود.',
    tone: 'bg-lavender-soft',
  },
]

export function AboutTeaser() {
  return (
    <Section
      tone="cream"
      eyebrow="درباره سازنده"
      title="رنگ را جدی می‌گیریم، مثل سطحی که رویش می‌نشیند"
      action={
        <Link to="/about" className="btn-ghost">
          درباره {brand.name}
          <ArrowLeft className="h-4 w-4" />
        </Link>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
        <div className="overflow-hidden rounded-panel bg-sand">
          <img
            src="/img/cat-exterior.jpg"
            alt="نمای ساختمان با پوشش رنگ‌آرا"
            width={700}
            height={470}
            loading="lazy"
            decoding="async"
            className="h-[280px] w-full object-cover sm:h-[380px]"
          />
        </div>

        <div className="space-y-4">
          {pillars.map((p) => (
            <div key={p.title} className={`rounded-card border border-plum/10 p-5 ${p.tone}`}>
              <h3 className="text-[1rem] font-bold text-plum">{p.title}</h3>
              <p className="mt-2 text-[0.88rem] leading-[1.9] text-plum-soft">{p.text}</p>
            </div>
          ))}
          <p className="text-[0.74rem] leading-relaxed text-plum-mute">
            این بخش در فایل داده قابل ویرایش است؛ متن نهایی باید با اطلاعات رسمی کارخانه جایگزین شود.
          </p>
        </div>
      </div>
    </Section>
  )
}
