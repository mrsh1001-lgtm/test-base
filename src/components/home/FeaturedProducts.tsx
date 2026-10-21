import { Link } from 'react-router-dom'
import { ArrowLeft } from '../Icons'
import { Section } from '../ui/Section'
import { ProductCard } from '../ui/ProductCard'
import { products } from '../../data/catalog'

const FEATURED = ['interior-matte-velvet', 'exterior-silicone', 'decorative-mineral']

export function FeaturedProducts() {
  const featured = products.filter((p) => FEATURED.includes(p.slug))

  return (
    <Section
      tone="white"
      eyebrow="محصولات منتخب"
      title="رنگ‌هایی که بیشتر انتخاب می‌شوند"
      intro="برای هر سطح، محصولی متناسب با همان شرایط: از دیوار داخلی تا نمای بیرونی و پوشش دکوراتیو."
      action={
        <Link to="/products" className="btn-ghost">
          همه محصولات
          <ArrowLeft className="h-4 w-4" />
        </Link>
      }
    >
      <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
        {featured.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
      <p className="mt-6 text-[0.76rem] text-plum-mute">
        تصاویر بسته‌بندی و مشخصات نمونه‌اند و باید با عکس و برگه فنی واقعی محصول جایگزین شوند.
      </p>
    </Section>
  )
}
