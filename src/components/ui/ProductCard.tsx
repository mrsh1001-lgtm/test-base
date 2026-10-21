import { Link } from 'react-router-dom'
import { ArrowLeft } from '../Icons'
import { cn } from '../../lib/utils'
import type { Product } from '../../data/types'
import { categoryBySlug } from '../../data/catalog'
import { SampleBadge } from './SampleBadge'

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const category = categoryBySlug(product.categorySlug)

  return (
    <article className="group flex flex-col overflow-hidden rounded-card border border-plum/10 bg-white transition duration-300 ease-soft hover:-translate-y-1 hover:shadow-lift">
      <Link to={`/products/${product.slug}`} className="block overflow-hidden bg-cream-deep" tabIndex={-1} aria-hidden="true">
        <img
          src={product.image}
          alt={product.imageAlt}
          width={480}
          height={compact ? 320 : 420}
          loading="lazy"
          decoding="async"
          className={cn(
            'w-full object-cover transition duration-700 ease-soft group-hover:scale-[1.04]',
            compact ? 'h-[210px]' : 'h-[280px]',
          )}
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[0.75rem] font-medium text-plum-mute">{category?.title}</span>
          {product.sample && <SampleBadge />}
        </div>
        <h3 className="mt-2 text-[1.1rem] font-bold leading-snug">
          <Link to={`/products/${product.slug}`} className="transition hover:text-violet">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1.5 text-[0.86rem] leading-relaxed text-plum-mute">{product.tagline}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-cream px-2.5 py-1 text-[0.72rem] text-plum-soft">{product.finish}</span>
          {product.performance.slice(0, 1).map((p) => (
            <span key={p} className="rounded-full bg-cream px-2.5 py-1 text-[0.72rem] text-plum-soft">
              {p}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-[0.75rem] text-plum-mute">
            کد محصول: <span className="ltr font-medium">{product.code}</span>
          </span>
          <Link to={`/products/${product.slug}`} className="link-arrow text-[0.84rem]">
            جزئیات
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}
