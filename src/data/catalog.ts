import type { Category, ColorFamily, ColorShade, Palette, Product } from './types'

export const categories: Category[] = [
  {
    slug: 'interior',
    title: 'رنگ‌های داخلی',
    blurb: 'پوشش‌های مات، مخملی و قابل شست‌وشو برای دیوار و سقف فضای زندگی.',
    image: '/img/cat-interior.jpg',
    imageAlt: 'اتاقی با دیوارهای صورتی گرم و سطل رنگ داخلی رنگ‌آرا',
    tone: 'coral',
    pillClass: 'bg-coral-soft text-plum group-hover:bg-coral',
  },
  {
    slug: 'exterior',
    title: 'رنگ‌های نما',
    blurb: 'پوشش‌های آبگریز و پایدار برای نما، در برابر آفتاب و باران.',
    image: '/img/cat-exterior.jpg',
    imageAlt: 'نمای بیرونی معماری با تن‌های فیروزه‌ای و زرد و سطل رنگ نما',
    tone: 'turquoise',
    pillClass: 'bg-turquoise-soft text-plum group-hover:bg-turquoise',
  },
  {
    slug: 'decorative',
    title: 'پوشش‌های دکوراتیو',
    blurb: 'بافت، درخشش و لایه‌های هنری برای دیوارهایی که دیده می‌شوند.',
    image: '/img/cat-decorative.jpg',
    imageAlt: 'بافت دیوار یاسی و بنفش با سطل پوشش دکوراتیو رنگ‌آرا',
    tone: 'lavender',
    pillClass: 'bg-lavender-soft text-plum group-hover:bg-lavender',
  },
]

export const colorFamilies: ColorFamily[] = [
  { slug: 'warm', name: 'قرمز و نارنجی', tone: 'coral', blurb: 'گرم، مهمان‌نواز و پرانرژی برای فضاهای نشیمن.' },
  { slug: 'sunny', name: 'زرد و خردلی', tone: 'sunny', blurb: 'نور و آفتاب؛ مناسب فضاهای کم‌نور و ورودی‌ها.' },
  { slug: 'aqua', name: 'سبز و فیروزه', tone: 'turquoise', blurb: 'تازگی و آرامش؛ برای اتاق کار، آشپزخانه و نما.' },
  { slug: 'blue', name: 'آبی', tone: 'cobalt', blurb: 'عمق و سکوت بصری؛ از یخی روشن تا نیلی تیره.' },
  { slug: 'violet', name: 'بنفش و یاسی', tone: 'lavender', blurb: 'شخصیت و ظرافت؛ برای دیوار شاخص و فضاهای شب.' },
  { slug: 'pink', name: 'صورتی و گلبهی', tone: 'pink', blurb: 'نرم و انسانی؛ برای اتاق خواب و فضاهای کوچک.' },
]

const rawShades: [string, string, string, string][] = [
  // slug, name, hex, family
  ['khakestari-korol', 'خشت کورال', '#F0685F', 'warm'],
  ['gojeh-farangi', 'گوجه‌ای', '#E14B3B', 'warm'],
  ['ajri-kohne', 'آجری کهنه', '#B24B32', 'warm'],
  ['narenji-khaki', 'نارنجی خاکی', '#D97B4B', 'warm'],
  ['korol-roshan', 'کورال روشن', '#FF8E80', 'warm'],
  ['okhra', 'اخرایی', '#C25E3A', 'warm'],

  ['aftab-tamam', 'آفتاب کامل', '#FFD447', 'sunny'],
  ['zard-kare', 'زرد کره', '#FFE28A', 'sunny'],
  ['khardali', 'خردلی', '#C99A25', 'sunny'],
  ['asal-tabiei', 'عسل طبیعی', '#E5A93F', 'sunny'],
  ['krem-vanili', 'کرم وانیلی', '#F7E7BF', 'sunny'],
  ['zard-limoei', 'زرد لیمویی', '#F2EA6B', 'sunny'],

  ['firooze-darya', 'فیروزه دریا', '#19BFC5', 'aqua'],
  ['sabz-maryam', 'سبز مریم', '#7FBF9B', 'aqua'],
  ['zeytoon-roshan', 'زیتونی روشن', '#A9AE6E', 'aqua'],
  ['sabz-kaj', 'سبز کاج', '#2F6B5A', 'aqua'],
  ['abi-naanai', 'آبی نعنایی', '#9BE3DA', 'aqua'],
  ['sabz-khaze', 'سبز خزه', '#6E8B4A', 'aqua'],

  ['abi-kobalt', 'آبی کبالت', '#2F5BEA', 'blue'],
  ['abi-nili', 'آبی نیلی', '#345C9C', 'blue'],
  ['abi-asemani', 'آبی آسمانی', '#8FC2E8', 'blue'],
  ['abi-fooladi', 'آبی فولادی', '#4E7C9B', 'blue'],
  ['abi-yakhi', 'آبی یخی', '#D8E8F4', 'blue'],
  ['abi-sangi', 'آبی سنگی', '#33475C', 'blue'],

  ['banafsh-saltanati', 'بنفش سلطنتی', '#6730E8', 'violet'],
  ['yasi-roshan', 'یاسی روشن', '#AD87EC', 'violet'],
  ['bademjani', 'بادمجانی', '#4B2A63', 'violet'],
  ['arghavani-doodi', 'ارغوانی دودی', '#7C5C8A', 'violet'],
  ['yasi-khakestari', 'یاسی خاکستری', '#C8BEDC', 'violet'],
  ['sharabi', 'شرابی', '#7A2E4A', 'violet'],

  ['golbehi-garm', 'گلبهی گرم', '#F2C4B2', 'pink'],
  ['sorati-korol', 'صورتی کورال', '#FF9BB8', 'pink'],
  ['sorati-poodri', 'صورتی پودری', '#F7CBD6', 'pink'],
  ['sorkhabi', 'سرخابی', '#D6437B', 'pink'],
  ['gol-anari', 'گل اناری', '#E86A8E', 'pink'],
  ['shiri-sorati', 'شیری صورتی', '#FBE3E4', 'pink'],
]

/** Light reflectance value is only shown where a real measurement exists — none supplied yet. */
export const colorShades: ColorShade[] = rawShades.map(([slug, name, hex, familySlug], i) => ({
  slug,
  name,
  code: `RA-${1000 + i * 17}`,
  hex,
  familySlug,
  lrv: null,
}))

export function shadeHex(slug: string): string {
  return colorShades.find((c) => c.slug === slug)?.hex ?? '#241038'
}

export const palettes: Palette[] = [
  {
    slug: 'aftab-va-korol',
    name: 'آفتاب و کورال',
    note: 'یک پالت گرم برای نشیمن رو به جنوب: زرد آفتاب روی دیوار اصلی، کورال روی دیوار شاخص.',
    colorSlugs: ['aftab-tamam', 'korol-roshan', 'krem-vanili', 'khakestari-korol'],
  },
  {
    slug: 'aramash-firooze',
    name: 'آرامش فیروزه',
    note: 'فیروزه در سقف و دیواره‌ها، آبی یخی روی سطوح بزرگ و یک لهجه زیتونی.',
    colorSlugs: ['firooze-darya', 'abi-yakhi', 'zeytoon-roshan', 'sabz-maryam'],
  },
  {
    slug: 'asr-yasi',
    name: 'عصر یاسی',
    note: 'یاسی روشن با بنفش سلطنتی برای اتاق خواب یا گوشه مطالعه.',
    colorSlugs: ['yasi-roshan', 'banafsh-saltanati', 'yasi-khakestari', 'shiri-sorati'],
  },
  {
    slug: 'khak-va-ajr',
    name: 'خاک و آجر',
    note: 'پالت نما: آجری کهنه و اخرایی در کنار آبی سنگی برای کنتراست نرم.',
    colorSlugs: ['ajri-kohne', 'okhra', 'abi-sangi', 'krem-vanili'],
  },
]

const SAMPLE_NOTE =
  'این ردیف اطلاعات نمونه است و باید با مشخصات واقعی محصول از کارخانه جایگزین شود.'

export const products: Product[] = [
  {
    slug: 'interior-matte-velvet',
    code: 'INT-M-01',
    name: 'رنگ داخلی مات مخملی',
    categorySlug: 'interior',
    usage: 'interior',
    tagline: 'پوشش مات یکدست برای دیوار و سقف فضای زندگی',
    description: [
      'پوشش پایه آب برای دیوارهای داخلی با ظاهر مات مخملی؛ سطحی یکدست که نور را نرم پخش می‌کند و رنگ را در همه زوایای دید ثابت نگه می‌دارد.',
      'برای دیوارهای پذیرایی، اتاق خواب و سقف مناسب است. جزئیات فنی این صفحه نمونه است و پس از دریافت برگه فنی کارخانه تکمیل می‌شود.',
    ],
    image: '/img/pack-interior.jpg',
    imageAlt: 'سطل رنگ داخلی رنگ‌آرا با زمینه صورتی',
    gallery: [
      { src: '/img/cat-interior.jpg', alt: 'دیوار صورتی گرم رنگ‌شده با رنگ داخلی مات' },
      { src: '/img/art-03.jpg', alt: 'مطالعه رنگ پالت صورتی و کورال' },
    ],
    surfaces: ['گچ و بتونه', 'بتن', 'دیوارهای رنگ‌شده قبلی'],
    finish: 'مات',
    performance: ['پوشانندگی بالا', 'پخش نور نرم', 'کم‌بو'],
    packaging: [
      { size: '۳/۶', unit: 'لیتر' },
      { size: '۱۲', unit: 'لیتر' },
    ],
    colorSlugs: ['krem-vanili', 'golbehi-garm', 'sorati-poodri', 'abi-yakhi', 'yasi-khakestari', 'aftab-tamam'],
    specs: [
      { label: 'پایه', value: 'آب' },
      { label: 'براقیت', value: 'مات' },
      { label: 'زمان خشک‌شدن سطحی', value: SAMPLE_NOTE },
    ],
    preparation: [
      'سطح را از گرد و غبار، چربی و لایه‌های شل پاک کنید.',
      'ترک‌ها و ناهمواری‌ها را با بتونه مناسب پر و سنباده کنید.',
      'در صورت نیاز از آستر مناسب همان سامانه استفاده کنید.',
    ],
    application: [
      'رنگ را پیش از مصرف کامل هم بزنید.',
      'با غلتک یا قلم‌موی مناسب دو لایه روی سطح بکشید.',
      'بین دو لایه زمان خشک‌شدن را رعایت کنید.',
    ],
    storage: ['در جای خشک و دور از یخ‌زدگی نگهداری شود.', 'درب ظرف پس از مصرف محکم بسته شود.'],
    safety: ['دور از دسترس کودکان نگهداری شود.', 'در فضای دارای تهویه مناسب استفاده شود.'],
    coverage: { value: 10, unit: 'متر مربع در هر لیتر برای هر لایه' },
    datasheetUrl: null,
    sdsUrl: null,
    catalogUrl: null,
    videoUrl: null,
    relatedSlugs: ['interior-washable', 'decorative-silk'],
    sample: true,
  },
  {
    slug: 'interior-washable',
    code: 'INT-W-02',
    name: 'رنگ داخلی قابل شست‌وشو',
    categorySlug: 'interior',
    usage: 'interior',
    tagline: 'سطح نیمه‌مات مقاوم برای آشپزخانه، راهرو و اتاق کودک',
    description: [
      'پوشش نیمه‌مات با سطح مقاوم‌تر برای فضاهایی که بیشتر در معرض لکه و شست‌وشو هستند.',
      'این توضیح نمونه است؛ مشخصات واقعی پس از دریافت اطلاعات کارخانه جایگزین می‌شود.',
    ],
    image: '/img/pack-interior.jpg',
    imageAlt: 'سطل رنگ داخلی رنگ‌آرا با زمینه صورتی',
    gallery: [{ src: '/img/art-03.jpg', alt: 'مطالعه رنگ پالت صورتی' }],
    surfaces: ['گچ و بتونه', 'بتن', 'سطوح رنگ‌شده قبلی'],
    finish: 'نیمه‌مات',
    performance: ['قابل شست‌وشو', 'مقاوم در برابر لکه', 'پوشانندگی بالا'],
    packaging: [
      { size: '۳/۶', unit: 'لیتر' },
      { size: '۱۲', unit: 'لیتر' },
    ],
    colorSlugs: ['abi-yakhi', 'sabz-maryam', 'golbehi-garm', 'krem-vanili'],
    specs: [
      { label: 'پایه', value: 'آب' },
      { label: 'براقیت', value: 'نیمه‌مات' },
    ],
    preparation: ['سطح تمیز و خشک باشد.', 'لایه‌های رنگ قدیمی شل را بردارید.'],
    application: ['دو لایه با فاصله زمانی مناسب اعمال شود.'],
    storage: ['در دمای بالای صفر نگهداری شود.'],
    safety: ['در تهویه مناسب استفاده شود.'],
    coverage: { value: 11, unit: 'متر مربع در هر لیتر برای هر لایه' },
    datasheetUrl: null,
    sdsUrl: null,
    catalogUrl: null,
    videoUrl: null,
    relatedSlugs: ['interior-matte-velvet', 'decorative-mineral'],
    sample: true,
  },
  {
    slug: 'exterior-silicone',
    code: 'EXT-S-01',
    name: 'رنگ نمای سیلیکونی',
    categorySlug: 'exterior',
    usage: 'exterior',
    tagline: 'آبگریز و پایدار برای نمای ساختمان',
    description: [
      'پوشش پایه سیلیکونی برای نمای بیرونی با سطح آبگریز و تنفس‌پذیر.',
      'مقادیر فنی این صفحه نمونه است و باید با داده واقعی برگه فنی جایگزین شود.',
    ],
    image: '/img/pack-exterior.jpg',
    imageAlt: 'سطل رنگ نمای رنگ‌آرا با زمینه فیروزه‌ای و زرد',
    gallery: [
      { src: '/img/cat-exterior.jpg', alt: 'نمای ساختمان با تن‌های فیروزه‌ای و زرد' },
      { src: '/img/art-02.jpg', alt: 'مطالعه رنگ پالت فیروزه‌ای و بنفش' },
    ],
    surfaces: ['بتن', 'سیمان', 'رندر معدنی', 'آجر'],
    finish: 'مات',
    performance: ['آبگریز', 'مقاومت در برابر اشعه فرابنفش', 'تنفس‌پذیر'],
    packaging: [
      { size: '۱۲', unit: 'لیتر' },
      { size: '۲۰', unit: 'لیتر' },
    ],
    colorSlugs: ['firooze-darya', 'abi-sangi', 'krem-vanili', 'ajri-kohne'],
    specs: [
      { label: 'پایه', value: 'سیلیکون' },
      { label: 'براقیت', value: 'مات' },
    ],
    preparation: ['سطح باید کاملاً خشک و عاری از گرد باشد.', 'تعمیر ترک‌ها پیش از رنگ‌آمیزی انجام شود.'],
    application: ['اعمال دو لایه با غلتک نما.', 'از رنگ‌آمیزی در باران یا آفتاب مستقیم پرهیز شود.'],
    storage: ['دور از یخ‌زدگی نگهداری شود.'],
    safety: ['از تماس با چشم پرهیز شود.'],
    coverage: { value: 8, unit: 'متر مربع در هر لیتر برای هر لایه' },
    datasheetUrl: null,
    sdsUrl: null,
    catalogUrl: null,
    videoUrl: null,
    relatedSlugs: ['exterior-acrylic', 'decorative-mineral'],
    sample: true,
  },
  {
    slug: 'exterior-acrylic',
    code: 'EXT-A-02',
    name: 'رنگ نمای آکریلیک',
    categorySlug: 'exterior',
    usage: 'exterior',
    tagline: 'پوشش اقتصادی نما با اجرای آسان',
    description: [
      'پوشش پایه آکریلیک برای نمای بیرونی با پوشانندگی مناسب و اجرای ساده.',
      'این محتوا نمونه است و پس از دریافت اطلاعات واقعی بازنویسی می‌شود.',
    ],
    image: '/img/pack-exterior.jpg',
    imageAlt: 'سطل رنگ نمای رنگ‌آرا با زمینه فیروزه‌ای و زرد',
    gallery: [{ src: '/img/art-02.jpg', alt: 'مطالعه رنگ پالت فیروزه‌ای' }],
    surfaces: ['بتن', 'سیمان', 'رندر معدنی'],
    finish: 'مات',
    performance: ['پوشانندگی بالا', 'مقاومت در برابر باران'],
    packaging: [
      { size: '۱۲', unit: 'لیتر' },
      { size: '۲۰', unit: 'لیتر' },
    ],
    colorSlugs: ['abi-asemani', 'krem-vanili', 'okhra', 'zeytoon-roshan'],
    specs: [{ label: 'پایه', value: 'آکریلیک' }],
    preparation: ['سطح خشک و تمیز باشد.'],
    application: ['دو لایه رنگ با فاصله زمانی مناسب.'],
    storage: ['در جای خشک نگهداری شود.'],
    safety: ['در تهویه مناسب استفاده شود.'],
    coverage: { value: 9, unit: 'متر مربع در هر لیتر برای هر لایه' },
    datasheetUrl: null,
    sdsUrl: null,
    catalogUrl: null,
    videoUrl: null,
    relatedSlugs: ['exterior-silicone'],
    sample: true,
  },
  {
    slug: 'decorative-mineral',
    code: 'DEC-K-01',
    name: 'پوشش کانی دکوراتیو',
    categorySlug: 'decorative',
    usage: 'interior',
    tagline: 'بافت معدنی برای دیوار شاخص',
    description: [
      'پوشش معدنی با بافت طبیعی برای دیوارهایی که می‌خواهند سطح باشند، نه فقط رنگ.',
      'نمونه اجراها و مشخصات این صفحه باید با اطلاعات کارخانه تکمیل شود.',
    ],
    image: '/img/pack-decorative.jpg',
    imageAlt: 'سطل پوشش دکوراتیو رنگ‌آرا با زمینه یاسی',
    gallery: [
      { src: '/img/cat-decorative.jpg', alt: 'دیوار با بافت یاسی و بنفش' },
      { src: '/img/art-06.jpg', alt: 'مطالعه رنگ پالت یاسی و کورال' },
    ],
    surfaces: ['گچ', 'بتن', 'MDF آماده‌شده'],
    finish: 'بافت‌دار',
    performance: ['بافت طبیعی', 'قابل اجرا با ابزار بافت'],
    packaging: [{ size: '۱۰', unit: 'کیلوگرم' }],
    colorSlugs: ['yasi-roshan', 'arghavani-doodi', 'krem-vanili', 'abi-sangi'],
    specs: [{ label: 'پایه', value: 'معدنی' }],
    preparation: ['سطح صاف و پرایم‌شده باشد.'],
    application: ['اجرا با ماله یا ابزار بافت توسط مجری مجرب.'],
    storage: ['در جای خشک نگهداری شود.'],
    safety: ['استفاده از ماسک در هنگام اجرا توصیه می‌شود.'],
    coverage: null,
    datasheetUrl: null,
    sdsUrl: null,
    catalogUrl: null,
    videoUrl: null,
    relatedSlugs: ['decorative-silk', 'interior-matte-velvet'],
    sample: true,
  },
  {
    slug: 'decorative-silk',
    code: 'DEC-S-02',
    name: 'پوشش ابریشمی دکوراتیو',
    categorySlug: 'decorative',
    usage: 'interior',
    tagline: 'درخشش ملایم و لایه‌های عمق روی دیوار',
    description: [
      'پوشش دکوراتیو با درخشش ابریشمی که عمق رنگ را در زوایای مختلف تغییر می‌دهد.',
      'محتوای نمونه؛ مشخصات اجرایی پس از دریافت اطلاعات کارخانه به‌روزرسانی می‌شود.',
    ],
    image: '/img/pack-decorative.jpg',
    imageAlt: 'سطل پوشش دکوراتیو رنگ‌آرا با زمینه یاسی',
    gallery: [{ src: '/img/art-04.jpg', alt: 'مطالعه رنگ پالت بنفش و کورال' }],
    surfaces: ['گچ', 'بتن', 'سطوح رنگ‌شده'],
    finish: 'ابریشمی',
    performance: ['درخشش ملایم', 'عمق بصری'],
    packaging: [{ size: '۵', unit: 'لیتر' }],
    colorSlugs: ['banafsh-saltanati', 'yasi-roshan', 'sharabi', 'gol-anari'],
    specs: [{ label: 'براقیت', value: 'ابریشمی' }],
    preparation: ['سطح پایه یکدست و رنگ‌شده باشد.'],
    application: ['اجرا با اسفنج یا قلم‌موی مخصوص بافت.'],
    storage: ['در دمای اتاق نگهداری شود.'],
    safety: ['در فضای دارای تهویه استفاده شود.'],
    coverage: null,
    datasheetUrl: null,
    sdsUrl: null,
    catalogUrl: null,
    videoUrl: null,
    relatedSlugs: ['decorative-mineral', 'interior-washable'],
    sample: true,
  },
]

export const productBySlug = (slug?: string) => products.find((p) => p.slug === slug)
export const categoryBySlug = (slug?: string) => categories.find((c) => c.slug === slug)
export const shadeBySlug = (slug?: string) => colorShades.find((c) => c.slug === slug)
export const familyBySlug = (slug?: string) => colorFamilies.find((f) => f.slug === slug)
export const paletteBySlug = (slug?: string) => palettes.find((p) => p.slug === slug)

/** Products whose stored attributes include the given colour. */
export const productsForShade = (shadeSlug: string) =>
  products.filter((p) => p.colorSlugs.includes(shadeSlug))
