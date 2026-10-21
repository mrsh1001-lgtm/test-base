import { useEffect } from 'react'

/** Join conditional class names without a dependency. */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ')
}

const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

/** Persian digits for numbers shown inside Persian copy. */
export function faNum(value: string | number): string {
  return String(value).replace(/\d/g, (d) => FA_DIGITS[Number(d)])
}

export function faNumber(value: number, fractionDigits = 0): string {
  const fixed = value.toFixed(fractionDigits)
  const trimmed = fractionDigits > 0 ? fixed.replace(/\.0+$/, '') : fixed
  return faNum(trimmed.replace('.', '٫'))
}

/**
 * Per-page document title and description. Kept deliberately small: no extra
 * dependency, just the two tags that matter for unique page metadata.
 */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title
    if (description) {
      let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      if (!tag) {
        tag = document.createElement('meta')
        tag.name = 'description'
        document.head.appendChild(tag)
      }
      tag.content = description
    }
  }, [title, description])
}
