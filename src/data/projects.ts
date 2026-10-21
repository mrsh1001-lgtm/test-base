import type { Project } from './types'

/**
 * Inspiration projects.
 *
 * `colourStudy: true` marks an editorial colour study rather than a photographed
 * project — the UI labels those honestly instead of presenting them as jobs.
 */
export const projects: Project[] = [
  {
    slug: 'khane-aftab',
    title: 'خانه‌ی آفتاب',
    space: 'پذیرایی',
    style: 'معاصر گرم',
    summary:
      'دیوار زرد آفتابی به‌عنوان دیوار شاخص، با کورال روی قوس و سقفی کرم که نور روز را برمی‌گرداند.',
    body: [
      'این نشیمن رو به جنوب با یک دیوار شاخص زرد شروع می‌شود و با کورال روی قوس معماری، شدت رنگ را متعادل می‌کند. سطوح بزرگ کرم نگه داشته شده‌اند تا رنگ اصلی فضا نفس بکشد.',
      'انتخاب رنگ برای فضای پرنور باید با نمونه فیزیکی در همان نور بررسی شود؛ آفتاب مستقیم تن رنگ را روشن‌تر و اشباع‌تر نشان می‌دهد.',
    ],
    image: '/img/cat-interior.jpg',
    imageAlt: 'نشیمن با دیوار رنگ‌شده و سطل رنگ داخلی',
    colorSlugs: ['aftab-tamam', 'korol-roshan', 'krem-vanili', 'golbehi-garm'],
    productSlugs: ['interior-matte-velvet', 'interior-washable'],
    paletteSlug: 'aftab-va-korol',
    colourStudy: false,
    sample: true,
  },
  {
    slug: 'namaye-firooze',
    title: 'نمای فیروزه',
    space: 'نما',
    style: 'مدرن مدیترانه‌ای',
    summary: 'نمای ساختمانی با تن فیروزه‌ای و قاب‌های زرد؛ کنتراستی که در آفتاب تند ظهر هم خوانا می‌ماند.',
    body: [
      'در نمای جنوبی، رنگ‌های اشباع در نور کامل خورشید کمرنگ‌تر دیده می‌شوند. فیروزه دریا در کنار قاب‌های زرد، عمق نما را حفظ می‌کند.',
      'برای نما، انتخاب محصول آبگریز و تنفس‌پذیر مهم‌تر از تن رنگ است؛ چرخه‌ی رنگ‌آمیزی نمای بیرونی طولانی است.',
    ],
    image: '/img/cat-exterior.jpg',
    imageAlt: 'نمای ساختمان با تن فیروزه‌ای و زرد',
    colorSlugs: ['firooze-darya', 'aftab-tamam', 'krem-vanili', 'abi-sangi'],
    productSlugs: ['exterior-silicone', 'exterior-acrylic'],
    paletteSlug: 'khak-va-ajr',
    colourStudy: false,
    sample: true,
  },
  {
    slug: 'divar-yasi',
    title: 'دیوار یاسی',
    space: 'اتاق خواب',
    style: 'آرام و مینیمال',
    summary: 'بافت یاسی با نور ملایم کنار تخت؛ سطحی که در شب تیره‌تر و در روز روشن‌تر خوانده می‌شود.',
    body: [
      'یاسی روشن در اتاق خواب، به‌خصوص در ترکیب با چوب روشن، فضایی آرام می‌سازد. اگر دیوار بافت داشته باشد، درخشش ابریشمی رنگ، عمق بیشتری به سطح می‌دهد.',
      'برای اتاق خواب، نمونه رنگ را زیر همان نور شب و روز بررسی کنید؛ اختلاف دمای رنگ نور، تن را کاملاً عوض می‌کند.',
    ],
    image: '/img/cat-decorative.jpg',
    imageAlt: 'دیوار یاسی با بافت دکوراتیو',
    colorSlugs: ['yasi-roshan', 'yasi-khakestari', 'shiri-sorati'],
    productSlugs: ['decorative-silk', 'interior-matte-velvet'],
    paletteSlug: 'asr-yasi',
    colourStudy: false,
    sample: true,
  },
  {
    slug: 'motalee-asr-yasi',
    title: 'مطالعه رنگ: عصر یاسی',
    space: 'مطالعه رنگ',
    style: 'پالت',
    summary: 'یک پالت شبانه از یاسی روشن، بنفش سلطنتی و شیری صورتی برای فضای کوچک با نور کم.',
    body: [
      'این مطالعه رنگ نشان می‌دهد چگونه سه تن از یک خانواده می‌توانند بدون شلوغی در کنار هم بنشینند: یک تن روشن برای سطوح بزرگ، یک تن عمیق برای دیوار شاخص و یک تن خنثی برای تعادل.',
      'پالت مطالعه است، نه عکس پروژه‌ی اجراشده.',
    ],
    image: '/img/art-06.jpg',
    imageAlt: 'مطالعه رنگ با تن‌های یاسی، صورتی و بنفش',
    colorSlugs: ['yasi-roshan', 'banafsh-saltanati', 'shiri-sorati', 'yasi-khakestari'],
    productSlugs: ['decorative-silk', 'interior-washable'],
    paletteSlug: 'asr-yasi',
    colourStudy: true,
    sample: true,
  },
  {
    slug: 'motalee-aftab',
    title: 'مطالعه رنگ: آفتاب و کورال',
    space: 'مطالعه رنگ',
    style: 'پالت',
    summary: 'زرد آفتاب، کورال و کرم وانیلی؛ الگویی برای دیوار شاخص در فضای پرنور.',
    body: [
      'در این پالت، زرد نقش نور و کورال نقش لهجه را دارد. کرم وانیلی سهم سطوح بزرگ را بر عهده می‌گیرد تا رنگ‌های اشباع خسته‌کننده نشوند.',
      'پالت مطالعه است، نه عکس پروژه‌ی اجراشده.',
    ],
    image: '/img/art-01.jpg',
    imageAlt: 'مطالعه رنگ با تن‌های زرد، کورال و کرم',
    colorSlugs: ['aftab-tamam', 'korol-roshan', 'krem-vanili'],
    productSlugs: ['interior-matte-velvet'],
    paletteSlug: 'aftab-va-korol',
    colourStudy: true,
    sample: true,
  },
  {
    slug: 'motalee-firooze',
    title: 'مطالعه رنگ: آرامش فیروزه',
    space: 'مطالعه رنگ',
    style: 'پالت',
    summary: 'فیروزه، آبی یخی و یک لهجه زیتونی برای فضاهایی که باید ساکت باشند.',
    body: [
      'ترکیب فیروزه و آبی یخی در سطوح بزرگ، فضایی خنثی و خنک می‌سازد و زیتونی روشن می‌تواند به‌عنوان لهجه در یک سطح کوچک ظاهر شود.',
      'پالت مطالعه است، نه عکس پروژه‌ی اجراشده.',
    ],
    image: '/img/art-02.jpg',
    imageAlt: 'مطالعه رنگ با تن‌های فیروزه‌ای و آبی',
    colorSlugs: ['firooze-darya', 'abi-yakhi', 'zeytoon-roshan'],
    productSlugs: ['exterior-silicone', 'interior-washable'],
    paletteSlug: 'aramash-firooze',
    colourStudy: true,
    sample: true,
  },
]

export const projectBySlug = (slug?: string) => projects.find((p) => p.slug === slug)
export const projectSpaces = Array.from(new Set(projects.map((p) => p.space)))
export const projectStyles = Array.from(new Set(projects.map((p) => p.style)))
