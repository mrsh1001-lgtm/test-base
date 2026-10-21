import { Link } from 'react-router-dom'
import { ArrowLeft } from '../components/Icons'
import { brand } from '../data/brand'
import { usePageMeta } from '../lib/utils'

export function NotFound() {
  usePageMeta('صفحه پیدا نشد | رنگ‌آرا', 'این نشانی در سایت رنگ‌آرا وجود ندارد.')

  return (
    <div className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-20 top-10 h-64 w-64 rounded-full bg-sunny-soft/70 blur-[80px]" />
        <div className="absolute bottom-0 left-10 h-64 w-64 rounded-full bg-coral-soft/70 blur-[80px]" />
        <div className="absolute right-1/3 top-1/2 h-52 w-52 rounded-full bg-turquoise-soft/60 blur-[70px]" />
      </div>

      <div className="shell flex min-h-[62vh] flex-col items-center justify-center py-20 text-center">
        <p className="text-[0.8rem] font-medium tracking-[0.2em] text-plum-mute">404</p>
        <h1 className="mt-3 max-w-xl text-display-lg text-balance">این دیوار رنگ‌نخورده است</h1>
        <p className="mt-3 max-w-md text-[0.95rem] leading-[1.95] text-plum-soft">
          صفحه‌ای که دنبالش بودید پیدا نشد. می‌توانید از کتاب رنگ شروع کنید یا به صفحه اصلی برگردید.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/" className="btn-primary">
            بازگشت به خانه
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <Link to="/colors" className="btn-ghost">
            کتاب رنگ
          </Link>
          <Link to="/products" className="btn-quiet">
            محصولات
          </Link>
        </div>

        <p className="mt-10 text-[0.8rem] text-plum-mute">
          اگر فکر می‌کنید این یک اشکال است، با {brand.name} تماس بگیرید.
        </p>
      </div>
    </div>
  )
}
