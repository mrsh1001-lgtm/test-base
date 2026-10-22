import { Link } from 'react-router-dom'
import { ArrowLeft, Download, Mail, MapPin, Phone } from '../Icons'
import { BrandLogo } from '../BrandLogo'
import { brand } from '../../data/brand'
import { categories } from '../../data/catalog'
import { downloads } from '../../data/dealers'
import { faNum } from '../../lib/utils'

const columns = [
  {
    title: 'محصولات',
    links: [
      ...categories.map((c) => ({ label: c.title, to: `/products?category=${c.slug}` })),
      { label: 'همه محصولات', to: '/products' },
    ],
  },
  {
    title: 'دنیای رنگ‌ها',
    links: [
      { label: 'کتاب رنگ', to: '/colors' },
      { label: 'پالت‌های پیشنهادی', to: '/colors#palettes' },
      { label: 'ایده و الهام', to: '/inspiration' },
      { label: 'استودیوی رنگ', to: '/#color-studio' },
    ],
  },
  {
    title: 'راهنما و محتوا',
    links: [
      { label: 'راهنمای اجرا', to: '/guides' },
      { label: 'مقالات', to: '/articles' },
      { label: 'محاسبه‌گر رنگ', to: '/#calculator' },
      { label: 'نمایندگی‌ها', to: '/dealers' },
    ],
  },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-plum/10 bg-cream-deep">
      <div className="shell grid gap-12 py-14 lg:grid-cols-[1.4fr_2fr]">
        <div>
          <BrandLogo />
          <p className="mt-4 max-w-sm text-[0.92rem] leading-[1.9] text-plum-soft">{brand.intro}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {brand.socials.map((s) =>
              s.href ? (
                <li key={s.label}>
                  <a
                    href={s.href}
                    className="chip"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {s.label}
                  </a>
                </li>
              ) : (
                <li key={s.label}>
                  <span className="chip cursor-default text-plum/40" title="نشانی شبکه اجتماعی هنوز ثبت نشده است">
                    {s.label}
                    <span className="text-[0.7rem]">به‌زودی</span>
                  </span>
                </li>
              ),
            )}
          </ul>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="text-[0.95rem] font-bold text-plum">{col.title}</h2>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.to + l.label}>
                    <Link to={l.to} className="text-[0.88rem] text-plum-soft transition hover:text-violet">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="shell grid gap-10 border-t border-plum/10 py-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="text-[0.95rem] font-bold text-plum">تماس</h2>
          <ul className="mt-4 flex flex-col gap-3 text-[0.88rem] text-plum-soft">
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-violet" />
              <span className="ltr" dir="ltr">
                {faNum(brand.phone)}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-violet" />
              <span className="ltr" dir="ltr">
                {brand.email}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-violet" />
              <span>{brand.address}</span>
            </li>
            <li className="text-plum-mute">{brand.workingHours}</li>
          </ul>
        </div>

        <div>
          <h2 className="text-[0.95rem] font-bold text-plum">فایل‌های قابل دریافت</h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {downloads.map((d) =>
              d.url ? (
                <li key={d.id}>
                  <a href={d.url} download className="inline-flex items-center gap-2 text-[0.88rem] text-violet hover:text-violet-deep">
                    <Download className="h-4 w-4" />
                    {d.title}
                  </a>
                </li>
              ) : (
                <li key={d.id} className="flex items-center gap-2 text-[0.88rem] text-plum/40">
                  <Download className="h-4 w-4" />
                  <span>{d.title}</span>
                  <span className="text-[0.72rem]">— هنوز بارگذاری نشده</span>
                </li>
              ),
            )}
          </ul>
          <Link to="/contact#form" className="link-arrow mt-5">
            درخواست مشاوره رنگ
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="border-t border-plum/10">
        <div className="shell flex flex-col gap-3 py-6 text-[0.78rem] text-plum-mute sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {faNum(year)} {brand.name} — تمام حقوق محفوظ است.
          </p>
          <p className="max-w-2xl leading-relaxed">
            محتوای این نسخه نمایشی است: نام تجاری، مشخصات فنی محصولات، اطلاعات تماس و فهرست نمایندگی‌ها باید با
            داده‌های واقعی کارخانه جایگزین شوند.
          </p>
        </div>
      </div>
    </footer>
  )
}
