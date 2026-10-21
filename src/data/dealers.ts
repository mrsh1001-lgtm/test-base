import type { Dealer, DownloadItem } from './types'

/**
 * Dealer directory — sample records only. Real sales network data has not been
 * supplied, so every record is flagged and the dealers page states this clearly.
 * The map is intentionally not rendered: no map provider is configured.
 */
export const dealers: Dealer[] = [
  { id: 'd-01', name: 'نمایندگی مرکزی نمونه', province: 'تهران', city: 'تهران', address: 'خیابان نمونه، پلاک ۱۲', phone: '۰۲۱-۰۰۰۰۰۰۰۰', kind: 'مرکز پخش', sample: true },
  { id: 'd-02', name: 'فروشگاه رنگ نمونه — ونک', province: 'تهران', city: 'تهران', address: 'خیابان ونک، پلاک ۴۵', phone: '۰۲۱-۰۰۰۰۰۰۰۰', kind: 'فروشگاه همکار', sample: true },
  { id: 'd-03', name: 'نمایندگی نمونه کرج', province: 'البرز', city: 'کرج', address: 'بلوار نمونه، پلاک ۸', phone: '۰۲۶-۰۰۰۰۰۰۰۰', kind: 'نمایندگی فروش', sample: true },
  { id: 'd-04', name: 'نمایندگی نمونه اصفهان', province: 'اصفهان', city: 'اصفهان', address: 'خیابان چهارباغ نمونه، پلاک ۲۲', phone: '۰۳۱-۰۰۰۰۰۰۰۰', kind: 'نمایندگی فروش', sample: true },
  { id: 'd-05', name: 'فروشگاه همکار نمونه — شاهین‌شهر', province: 'اصفهان', city: 'شاهین‌شهر', address: 'بلوار نمونه، پلاک ۳', phone: '۰۳۱-۰۰۰۰۰۰۰۰', kind: 'فروشگاه همکار', sample: true },
  { id: 'd-06', name: 'نمایندگی نمونه شیراز', province: 'فارس', city: 'شیراز', address: 'بلوار زند نمونه، پلاک ۱۹', phone: '۰۷۱-۰۰۰۰۰۰۰۰', kind: 'نمایندگی فروش', sample: true },
  { id: 'd-07', name: 'مرکز پخش نمونه مشهد', province: 'خراسان رضوی', city: 'مشهد', address: 'خیابان نمونه، پلاک ۷۷', phone: '۰۵۱-۰۰۰۰۰۰۰۰', kind: 'مرکز پخش', sample: true },
  { id: 'd-08', name: 'نمایندگی نمونه تبریز', province: 'آذربایجان شرقی', city: 'تبریز', address: 'خیابان نمونه، پلاک ۵۱', phone: '۰۴۱-۰۰۰۰۰۰۰۰', kind: 'نمایندگی فروش', sample: true },
  { id: 'd-09', name: 'فروشگاه همکار نمونه — رشت', province: 'گیلان', city: 'رشت', address: 'خیابان نمونه، پلاک ۱۴', phone: '۰۱۳-۰۰۰۰۰۰۰۰', kind: 'فروشگاه همکار', sample: true },
  { id: 'd-10', name: 'نمایندگی نمونه یزد', province: 'یزد', city: 'یزد', address: 'خیابان نمونه، پلاک ۶', phone: '۰۳۵-۰۰۰۰۰۰۰۰', kind: 'نمایندگی فروش', sample: true },
]

export const dealerProvinces = Array.from(new Set(dealers.map((d) => d.province)))

export const dealersByProvince = (province: string) =>
  province ? dealers.filter((d) => d.province === province) : dealers

/**
 * Only items with a real `url` become download buttons. A real, genuinely
 * useful file ships with the repo; catalogues and datasheets are not invented.
 */
export const downloads: DownloadItem[] = [
  {
    id: 'dl-checklist',
    title: 'چک‌لیست آماده‌سازی سطح',
    description: 'فهرست مرحله‌به‌مرحله پیش از رنگ‌آمیزی داخلی (فایل متنی)',
    kind: 'برگه فنی',
    url: '/files/surface-prep-checklist.txt',
    sample: false,
  },
  {
    id: 'dl-catalog',
    title: 'کاتالوگ محصولات',
    description: 'در انتظار دریافت فایل کاتالوگ رسمی کارخانه',
    kind: 'کاتالوگ',
    url: null,
    sample: true,
  },
  {
    id: 'dl-colorbook',
    title: 'کتاب رنگ',
    description: 'در انتظار دریافت فایل کتاب رنگ رسمی',
    kind: 'کاتالوگ',
    url: null,
    sample: true,
  },
]
