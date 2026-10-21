import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowLeft, ChevronDown, Close, Menu, Sparkle } from '../components/Icons'
import { BrandLogo } from '../components/BrandLogo'
import { categories, products } from '../data/catalog'
import { cn } from '../lib/utils'

const navItems = [
  { label: 'محصولات', to: '/products', mega: true },
  { label: 'دنیای رنگ‌ها', to: '/colors' },
  { label: 'ایده و الهام', to: '/inspiration' },
  { label: 'راهنمای اجرا', to: '/guides' },
  { label: 'درباره ما', to: '/about' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false)
  const megaWrapRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close every overlay when the route changes.
  useEffect(() => {
    setMegaOpen(false)
    setMobileOpen(false)
    setMobileProductsOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    if (!megaOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMegaOpen(false)
    }
    const onClick = (e: MouseEvent) => {
      if (megaWrapRef.current && !megaWrapRef.current.contains(e.target as Node)) setMegaOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClick)
    }
  }, [megaOpen])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const featured = products[0]

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-all duration-300 ease-soft',
        scrolled
          ? 'border-plum/10 bg-cream/95 shadow-[0_10px_30px_-24px_rgba(36,16,56,.45)] backdrop-blur-md'
          : 'border-transparent bg-cream',
      )}
    >
      <div className={cn('shell flex items-center justify-between gap-4 transition-all duration-300', scrolled ? 'h-[62px]' : 'h-[84px]')}>
        <BrandLogo compact={scrolled} />

        <nav aria-label="ناوبری اصلی" className="hidden lg:flex">
          <ul className="flex items-center gap-1">
            {navItems.map((item) =>
              item.mega ? (
                <li key={item.to} ref={megaWrapRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setMegaOpen((v) => !v)}
                    onMouseEnter={() => setMegaOpen(true)}
                    aria-expanded={megaOpen}
                    aria-controls="mega-menu"
                    className={cn(
                      'flex min-h-[44px] items-center gap-1.5 rounded-full px-4 text-[0.94rem] font-medium transition',
                      megaOpen ? 'bg-plum/5 text-plum' : 'text-plum-soft hover:bg-plum/5 hover:text-plum',
                    )}
                  >
                    {item.label}
                    <ChevronDown className={cn('h-4 w-4 transition-transform', megaOpen && 'rotate-180')} />
                  </button>
                  {megaOpen && (
                    <div
                      id="mega-menu"
                      className="absolute right-0 top-[calc(100%+10px)] w-[min(760px,80vw)] animate-fade-in rounded-panel border border-plum/10 bg-white p-5 shadow-lift"
                    >
                      <div className="grid grid-cols-[1fr_240px] gap-5">
                        <ul className="grid gap-2">
                          {categories.map((cat) => (
                            <li key={cat.slug}>
                              <Link
                                to={`/products?category=${cat.slug}`}
                                className="group flex items-center gap-3 rounded-2xl p-2 transition hover:bg-cream-deep"
                              >
                                <img
                                  src={cat.image}
                                  alt=""
                                  width={96}
                                  height={72}
                                  loading="lazy"
                                  className="h-[62px] w-[84px] rounded-xl object-cover"
                                />
                                <span className="min-w-0 flex-1">
                                  <span className="block text-[0.95rem] font-semibold text-plum">{cat.title}</span>
                                  <span className="mt-0.5 block truncate text-[0.8rem] text-plum-mute">{cat.blurb}</span>
                                </span>
                                <ArrowLeft className="h-4 w-4 shrink-0 text-plum/30 transition group-hover:text-violet" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <div className="rounded-2xl bg-cream p-4">
                          <span className="eyebrow">
                            <Sparkle className="h-4 w-4 text-coral" />
                            تازه‌ترین محصول
                          </span>
                          {featured && (
                            <>
                              <p className="mt-2 text-[0.95rem] font-semibold text-plum">{featured.name}</p>
                              <p className="mt-1 text-[0.8rem] leading-relaxed text-plum-mute">{featured.tagline}</p>
                              <img
                                src={featured.image}
                                alt={featured.imageAlt}
                                width={200}
                                height={140}
                                loading="lazy"
                                className="mt-3 h-[104px] w-full rounded-xl object-cover"
                              />
                              <Link to={`/products/${featured.slug}`} className="link-arrow mt-3 text-[0.85rem]">
                                مشاهده محصول
                                <ArrowLeft className="h-4 w-4" />
                              </Link>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-plum/10 pt-3">
                        <Link to="/products" className="link-arrow">
                          همه محصولات
                          <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <Link to="/colors" className="text-[0.85rem] text-plum-mute hover:text-violet">
                          کتاب رنگ
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              ) : (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        'relative flex min-h-[44px] items-center rounded-full px-4 text-[0.94rem] font-medium transition',
                        isActive ? 'text-plum' : 'text-plum-soft hover:bg-plum/5 hover:text-plum',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        <span
                          className={cn(
                            'absolute bottom-1.5 right-1/2 h-[3px] w-0 translate-x-1/2 rounded-full bg-coral transition-all duration-300',
                            isActive && 'w-4',
                          )}
                        />
                      </>
                    )}
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/contact#form" className="btn-primary hidden lg:inline-flex">
            مشاوره رنگ
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="btn-ghost !min-h-[44px] !w-11 !px-0 lg:hidden"
            aria-label="بازکردن منو"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="بستن منو"
            className="absolute inset-0 h-full w-full bg-plum/40"
            onClick={() => setMobileOpen(false)}
          />
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="منوی اصلی"
            className="absolute inset-y-0 right-0 flex w-[min(92vw,400px)] animate-fade-in flex-col overflow-y-auto bg-cream p-5 shadow-lift"
          >
            <div className="flex items-center justify-between">
              <BrandLogo compact onNavigate={() => setMobileOpen(false)} />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="btn-ghost !min-h-[44px] !w-11 !px-0"
                aria-label="بستن منو"
              >
                <Close className="h-5 w-5" />
              </button>
            </div>

            <nav aria-label="ناوبری موبایل" className="mt-6">
              <ul className="flex flex-col gap-1">
                <li>
                  <button
                    type="button"
                    onClick={() => setMobileProductsOpen((v) => !v)}
                    aria-expanded={mobileProductsOpen}
                    className="flex min-h-[52px] w-full items-center justify-between rounded-2xl px-3 text-[1rem] font-semibold text-plum hover:bg-plum/5"
                  >
                    محصولات
                    <ChevronDown className={cn('h-5 w-5 transition-transform', mobileProductsOpen && 'rotate-180')} />
                  </button>
                  {mobileProductsOpen && (
                    <ul className="mb-2 mr-2 flex flex-col gap-1 border-r border-plum/15 pr-3">
                      {categories.map((cat) => (
                        <li key={cat.slug}>
                          <Link
                            to={`/products?category=${cat.slug}`}
                            onClick={() => setMobileOpen(false)}
                            className="flex min-h-[46px] items-center rounded-xl px-2 text-[0.95rem] text-plum-soft hover:text-violet"
                          >
                            {cat.title}
                          </Link>
                        </li>
                      ))}
                      <li>
                        <Link
                          to="/products"
                          onClick={() => setMobileOpen(false)}
                          className="flex min-h-[46px] items-center rounded-xl px-2 text-[0.95rem] font-semibold text-violet"
                        >
                          همه محصولات
                        </Link>
                      </li>
                    </ul>
                  )}
                </li>
                {navItems
                  .filter((i) => !i.mega)
                  .map((item) => (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className="flex min-h-[52px] items-center rounded-2xl px-3 text-[1rem] font-semibold text-plum hover:bg-plum/5"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                <li>
                  <Link
                    to="/dealers"
                    onClick={() => setMobileOpen(false)}
                    className="flex min-h-[52px] items-center rounded-2xl px-3 text-[1rem] font-semibold text-plum hover:bg-plum/5"
                  >
                    نمایندگی‌ها
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="mt-auto pt-6">
              <Link to="/contact#form" onClick={() => setMobileOpen(false)} className="btn-primary w-full">
                درخواست مشاوره
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link to="/contact" onClick={() => setMobileOpen(false)} className="btn-quiet mt-2 w-full">
                تماس با ما
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
