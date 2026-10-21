import { Link } from 'react-router-dom'
import { BrandMark } from '../components/Icons'
import { brand } from '../data/brand'
import { cn } from '../lib/utils'

interface BrandLogoProps {
  to?: string
  compact?: boolean
  className?: string
  onNavigate?: () => void
}

export function BrandLogo({ to = '/', compact = false, className, onNavigate }: BrandLogoProps) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={cn('group inline-flex items-center gap-2.5', className)}
      aria-label={`${brand.name} — صفحه اصلی`}
    >
      <BrandMark className={cn('transition-transform duration-500 ease-soft group-hover:rotate-6', compact ? 'h-9 w-9' : 'h-11 w-11')} />
      <span className="flex flex-col leading-none">
        <span className={cn('font-bold tracking-tight text-plum', compact ? 'text-[1.15rem]' : 'text-[1.35rem]')}>
          {brand.name}
        </span>
        {!compact && (
          <span className="mt-1 text-[0.66rem] font-medium tracking-[0.18em] text-plum-mute">ARCHITECTURAL PAINT</span>
        )}
      </span>
    </Link>
  )
}
