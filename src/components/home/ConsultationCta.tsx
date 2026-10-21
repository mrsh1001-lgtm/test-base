import { Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Sparkle } from '../Icons'

/** End-of-page paths to advice and dealer discovery. */
export function ConsultationCta() {
  return (
    <section className="pb-4 pt-6">
      <div className="shell">
        <div className="relative overflow-hidden rounded-panel bg-violet px-6 py-12 text-cream sm:px-12 sm:py-16">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-coral/40 blur-[70px]" />
            <div className="absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-turquoise/35 blur-[80px]" />
            <div className="absolute left-10 top-6 h-32 w-32 rounded-full bg-sunny/30 blur-[60px]" />
          </div>

          <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-[0.8rem] text-cream/80">
                <Sparkle className="h-4 w-4" />
                مشاوره رنگ و نمایندگی‌ها
              </p>
              <h2 className="mt-3 text-display-md text-white">
                رنگ را با هم انتخاب کنیم
              </h2>
              <p className="mt-3 max-w-xl text-[0.95rem] leading-[1.95] text-cream/85">
                برای انتخاب محصول مناسب سطح، پیشنهاد پالت یا پیدا کردن نزدیک‌ترین نمایندگی، درخواست خود را ثبت کنید.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link
                to="/contact#form"
                className="btn !min-h-[52px] bg-cream px-6 text-plum hover:-translate-y-0.5 hover:bg-white"
              >
                درخواست مشاوره
                <ArrowLeft className="h-[18px] w-[18px]" />
              </Link>
              <Link
                to="/dealers"
                className="btn !min-h-[52px] border border-cream/40 px-6 text-cream hover:bg-cream/10"
              >
                <MapPin className="h-[18px] w-[18px]" />
                یافتن نمایندگی
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
