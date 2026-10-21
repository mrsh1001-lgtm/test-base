import { Link } from 'react-router-dom'
import { ArrowLeft } from '../Icons'
import { categories } from '../../data/catalog'
import { cn } from '../../lib/utils'

/** Three image-led category cards, mirroring the reference composition. */
export function CategoryCards() {
  return (
    <section className="pb-6 pt-16 sm:pt-20">
      <div className="shell">
        <p className="rule-with-label mx-auto max-w-md">دنیایی از رنگ، برای هر فضا</p>

        <div className="mt-10 grid gap-5 sm:gap-6 md:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              className="group block focus-visible:outline-offset-8"
            >
              <div className="relative overflow-hidden rounded-card bg-sand">
                <img
                  src={cat.image}
                  alt={cat.imageAlt}
                  width={480}
                  height={276}
                  loading="lazy"
                  decoding="async"
                  className="h-[240px] w-full object-cover transition duration-[700ms] ease-soft group-hover:scale-[1.04] sm:h-[280px]"
                />
                <div className="absolute inset-x-0 bottom-4 flex justify-center">
                  <span
                    className={cn(
                      'inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 text-[0.88rem] font-semibold shadow-soft transition duration-300 ease-soft',
                      cat.pillClass,
                    )}
                  >
                    {cat.title}
                    <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" />
                  </span>
                </div>
              </div>
              <p className="mt-3 px-1 text-[0.86rem] leading-relaxed text-plum-mute">{cat.blurb}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
