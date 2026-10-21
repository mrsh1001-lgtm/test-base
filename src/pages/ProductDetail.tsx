import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Download, Play } from '../components/Icons'
import { SampleBadge } from '../components/ui/SampleBadge'
import { ProductCard } from '../components/ui/ProductCard'
import { NotFound } from './NotFound'
import { categoryBySlug, productBySlug, products, shadeBySlug } from '../data/catalog'
import { faNum, usePageMeta } from '../lib/utils'
import { cn } from '../lib/utils'

export function ProductDetail() {
  const { slug } = useParams()
  const product = productBySlug(slug)
  const [activeImage, setActiveImage] = useState(0)

  usePageMeta(
    product ? `${product.name} | رنگ‌آرا` : 'محصول یافت نشد | رنگ‌آرا',
    product?.tagline,
  )

  if (!product) return <NotFound />

  const category = categoryBySlug(product.categorySlug)
  const images = [{ src: product.image, alt: product.imageAlt }, ...product.gallery]
  const related = products.filter((p) => product.relatedSlugs.includes(p.slug))
  const current = images[Math.min(activeImage, images.length - 1)]

  const documents = [
    { label: 'برگه اطلاعات فنی (TDS)', url: product.datasheetUrl },
    { label: 'برگه ایمنی (SDS)', url: product.sdsUrl },
    { label: 'کاتالوگ محصول', url: product.catalogUrl },
  ]

  return (
    <>
      <div className="border-b border-plum/10 bg-cream-deep">
        <div className="shell flex flex-wrap items-center gap-2 py-4 text-[0.78rem] text-plum-mute">
          <Link to="/" className="hover:text-violet">
            خانه
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/products" className="hover:text-violet">
            محصولات
          </Link>
          <span aria-hidden="true">/</span>
          <Link to={`/products?category=${product.categorySlug}`} className="hover:text-violet">
            {category?.title}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-plum">{product.name}</span>
        </div>
      </div>

      <div className="shell py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          {/* Gallery */}
          <div className="order-2 lg:order-1">
            <div className="overflow-hidden rounded-panel border border-plum/10 bg-white">
              <img
                src={current.src}
                alt={current.alt}
                width={860}
                height={620}
                className="h-[340px] w-full object-cover sm:h-[440px]"
              />
            </div>
            {images.length > 1 && (
              <ul className="mt-3 flex gap-2">
                {images.map((img, i) => (
                  <li key={img.src + i}>
                    <button
                      type="button"
                      onClick={() => setActiveImage(i)}
                      aria-pressed={i === activeImage}
                      className={cn(
                        'overflow-hidden rounded-xl border-2 transition',
                        i === activeImage ? 'border-violet' : 'border-transparent opacity-70 hover:opacity-100',
                      )}
                    >
                      <img src={img.src} alt="" width={96} height={72} loading="lazy" className="h-[70px] w-[96px] object-cover" />
                      <span className="sr-only">{img.alt}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-3 text-[0.72rem] text-plum-mute">
              تصویر بسته‌بندی نمونه است و باید با عکس رسمی محصول جایگزین شود.
            </p>
          </div>

          {/* Summary */}
          <div className="order-1 lg:order-2">
            <div className="flex flex-wrap items-center gap-2 text-[0.78rem] text-plum-mute">
              <Link to={`/products?category=${product.categorySlug}`} className="rounded-full bg-plum/5 px-2.5 py-1">
                {category?.title}
              </Link>
              <span className="ltr rounded-full bg-plum/5 px-2.5 py-1">کد {product.code}</span>
              {product.sample && <SampleBadge />}
            </div>

            <h1 className="mt-3 text-display-md">{product.name}</h1>
            <p className="mt-2 text-[1rem] leading-[1.9] text-plum-soft">{product.tagline}</p>

            <dl className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-plum/10 bg-white p-3">
                <dt className="text-[0.72rem] text-plum-mute">پرداخت نهایی</dt>
                <dd className="mt-0.5 text-[0.9rem] font-semibold text-plum">{product.finish}</dd>
              </div>
              <div className="rounded-2xl border border-plum/10 bg-white p-3">
                <dt className="text-[0.72rem] text-plum-mute">کاربرد</dt>
                <dd className="mt-0.5 text-[0.9rem] font-semibold text-plum">
                  {product.usage === 'interior' ? 'فضای داخلی' : product.usage === 'exterior' ? 'نمای بیرونی' : 'داخلی و نما'}
                </dd>
              </div>
            </dl>

            <div className="mt-4 rounded-2xl border border-plum/10 bg-white p-4">
              <p className="text-[0.78rem] font-semibold text-plum">بسته‌بندی موجود</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.packaging.map((p) => (
                  <span key={`${p.size}-${p.unit}`} className="rounded-full bg-cream px-3 py-1 text-[0.8rem] text-plum-soft">
                    {faNum(p.size)} {p.unit}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-[0.78rem] font-semibold text-plum">رنگ‌های موجود</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {product.colorSlugs.map((slugName) => {
                  const shade = shadeBySlug(slugName)
                  if (!shade) return null
                  return (
                    <li key={slugName}>
                      <Link
                        to={`/colors/${shade.slug}`}
                        className="flex items-center gap-2 rounded-full border border-plum/12 bg-white py-1 pl-3 pr-1 text-[0.78rem] text-plum-soft transition hover:border-plum/30"
                      >
                        <span className="h-5 w-5 rounded-full ring-1 ring-plum/15" style={{ backgroundColor: shade.hex }} />
                        {shade.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to={`/contact?product=${product.slug}#form`} className="btn-primary">
                درخواست مشاوره و استعلام قیمت
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link to="/dealers" className="btn-ghost">
                نمایندگی‌ها
              </Link>
            </div>

            <p className="mt-4 text-[0.74rem] leading-relaxed text-plum-mute">
              مشخصات عددی این صفحه تا زمان دریافت برگه فنی رسمی، نمونه است.
            </p>
          </div>
        </div>

        {/* Description + specs */}
        <div className="mt-14 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="text-[1.25rem] font-bold">درباره این محصول</h2>
            <div className="mt-3 space-y-3 text-[0.95rem] leading-[1.95] text-plum-soft">
              {product.description.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>

            <h2 className="mt-8 text-[1.25rem] font-bold">سطوح قابل اجرا</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {product.surfaces.map((s) => (
                <li key={s} className="rounded-full bg-white px-3 py-1.5 text-[0.82rem] text-plum-soft">
                  {s}
                </li>
              ))}
            </ul>

            {product.preparation && product.preparation.length > 0 && (
              <DetailList title="آماده‌سازی سطح" items={product.preparation} />
            )}
            {product.application && product.application.length > 0 && (
              <DetailList title="دستور اجرا" items={product.application} />
            )}
          </div>

          <div>
            {product.specs.length > 0 && (
              <div className="rounded-panel border border-plum/10 bg-white p-5">
                <h2 className="text-[1.05rem] font-bold">مشخصات فنی</h2>
                <dl className="mt-3 divide-y divide-plum/10">
                  {product.specs.map((spec) => (
                    <div key={spec.label} className="flex items-start justify-between gap-4 py-2.5">
                      <dt className="text-[0.84rem] text-plum-mute">{spec.label}</dt>
                      <dd className={cn('max-w-[60%] text-left text-[0.84rem] font-medium text-plum', spec.ltr && 'ltr')}>
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {product.storage && product.storage.length > 0 && <DetailList title="نگهداری" items={product.storage} boxed />}
            {product.safety && product.safety.length > 0 && <DetailList title="ایمنی" items={product.safety} boxed />}

            <div className="mt-6 rounded-panel border border-plum/10 bg-white p-5">
              <h2 className="text-[1.05rem] font-bold">فایل‌ها و ویدیو</h2>
              <ul className="mt-3 space-y-2">
                {documents.map((doc) => (
                  <li key={doc.label}>
                    {doc.url ? (
                      <a href={doc.url} className="link-arrow text-[0.86rem]" download>
                        <Download className="h-4 w-4" />
                        {doc.label}
                      </a>
                    ) : (
                      <span className="flex items-center gap-2 text-[0.84rem] text-plum/35">
                        <Download className="h-4 w-4" />
                        {doc.label}
                        <span className="text-[0.72rem]">— هنوز بارگذاری نشده</span>
                      </span>
                    )}
                  </li>
                ))}
                <li>
                  {product.videoUrl ? (
                    <a href={product.videoUrl} className="link-arrow text-[0.86rem]" target="_blank" rel="noreferrer">
                      <Play className="h-4 w-4" />
                      ویدیو اجرای محصول
                    </a>
                  ) : (
                    <span className="flex items-center gap-2 text-[0.84rem] text-plum/35">
                      <Play className="h-4 w-4" />
                      ویدیو اجرا
                      <span className="text-[0.72rem]">— هنوز بارگذاری نشده</span>
                    </span>
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-[1.25rem] font-bold">محصولات مرتبط</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} compact />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function DetailList({ title, items, boxed = false }: { title: string; items: string[]; boxed?: boolean }) {
  return (
    <div className={cn(boxed && 'mt-6 rounded-panel border border-plum/10 bg-white p-5')}>
      <h2 className={cn('text-[1.05rem] font-bold', !boxed && 'mt-8 text-[1.25rem]')}>{title}</h2>
      <ul className="mt-3 space-y-2 text-[0.88rem] leading-[1.9] text-plum-soft">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
