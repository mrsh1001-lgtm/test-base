import type { ReactNode } from 'react'
import { cn } from '../lib/utils'

interface SectionProps {
  id?: string
  eyebrow?: string
  title?: ReactNode
  intro?: ReactNode
  action?: ReactNode
  children: ReactNode
  className?: string
  align?: 'start' | 'center'
  tone?: 'plain' | 'cream' | 'white'
}

export function Section({
  id,
  eyebrow,
  title,
  intro,
  action,
  children,
  className,
  align = 'start',
  tone = 'plain',
}: SectionProps) {
  const hasHeader = Boolean(eyebrow || title || intro || action)

  return (
    <section
      id={id}
      className={cn(
        'py-16 sm:py-20 lg:py-24',
        tone === 'cream' && 'bg-cream-deep',
        tone === 'white' && 'bg-white',
        className,
      )}
    >
      <div className="shell">
        {hasHeader && (
          <div
            className={cn(
              'mb-10 flex flex-col gap-5 sm:mb-12',
              align === 'center'
                ? 'items-center text-center'
                : 'sm:flex-row sm:items-end sm:justify-between',
            )}
          >
            <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
              {eyebrow && (
                <p className="eyebrow">
                  <span className="h-[6px] w-[6px] rounded-full bg-coral" aria-hidden="true" />
                  {eyebrow}
                </p>
              )}
              {title && <h2 className="section-title mt-3">{title}</h2>}
              {intro && <p className="mt-3 text-[0.98rem] leading-[1.9] text-plum-soft">{intro}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string
  title: string
  intro?: string
  children?: ReactNode
}) {
  return (
    <div className="border-b border-plum/10 bg-cream-deep">
      <div className="shell py-12 sm:py-16">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-3 max-w-3xl text-display-lg text-balance">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-[1rem] leading-[1.95] text-plum-soft">{intro}</p>}
        {children && <div className="mt-7">{children}</div>}
      </div>
    </div>
  )
}
