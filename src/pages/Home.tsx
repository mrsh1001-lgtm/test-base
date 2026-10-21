import { Hero } from '../components/home/Hero'
import { CategoryCards } from '../components/home/CategoryCards'
import { ColorStudio } from '../components/colorStudio/ColorStudio'
import { FeaturedProducts } from '../components/home/FeaturedProducts'
import { ProductFinder } from '../components/home/ProductFinder'
import { InspirationTeaser } from '../components/home/InspirationTeaser'
import { PaintCalculator } from '../components/home/PaintCalculator'
import { AboutTeaser } from '../components/home/AboutTeaser'
import { ArticlesTeaser } from '../components/home/ArticlesTeaser'
import { ConsultationCta } from '../components/home/ConsultationCta'
import { Section } from '../components/ui/Section'
import { usePageMeta } from '../lib/utils'
import { brand } from '../data/brand'

export function Home() {
  usePageMeta(
    `${brand.name} | رنگ معماری برای هر فضا`,
    'رنگی برای هر فضا، حسی برای هر روز. رنگ‌های داخلی، نما و پوشش‌های دکوراتیو رنگ‌آرا، با کتاب رنگ و راهنمای انتخاب محصول.',
  )

  return (
    <>
      <Hero />
      <CategoryCards />

      <Section
        id="color-studio"
        eyebrow="استودیوی رنگ"
        title="رنگ را قبل از خرید روی دیوار ببینید"
        intro="یک خانواده رنگ و یک تن انتخاب کنید تا روی دیوار اتاق نمایش داده شود. سطح دیوار با ماسک مشخص شده و نور، سایه و مبلمان دست‌نخورده می‌مانند."
      >
        <ColorStudio />
      </Section>

      <FeaturedProducts />
      <ProductFinder />
      <InspirationTeaser />
      <PaintCalculator />
      <AboutTeaser />
      <ArticlesTeaser />
      <ConsultationCta />
    </>
  )
}
