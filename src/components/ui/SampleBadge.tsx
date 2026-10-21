import { cn } from '../lib/utils'

/**
 * Marks content that is not real manufacturer data yet. Used on sample records
 * (products, dealers, projects) so nothing placeholder is presented as fact.
 */
export function SampleBadge({ className, label = 'نمونه' }: { className?: string; label?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border border-plum/15 bg-cream px-2 py-0.5 text-[0.68rem] font-medium text-plum-mute',
        className,
      )}
      title="این محتوا نمونه است و باید با داده‌های واقعی کارخانه جایگزین شود"
    >
      {label}
    </span>
  )
}

export function Notice({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'info' }) {
  return (
    <p
      className={cn(
        'rounded-2xl border px-4 py-3 text-[0.82rem] leading-relaxed',
        tone === 'info'
          ? 'border-turquoise/30 bg-turquoise-soft/60 text-plum-soft'
          : 'border-plum/12 bg-white text-plum-mute',
      )}
    >
      {children}
    </p>
  )
}
