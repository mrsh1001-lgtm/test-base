import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'rangara:favorite-colors'
const EVENT = 'rangara:favorites-changed'

function read(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : []
  } catch {
    return []
  }
}

/**
 * Saved colours, kept in localStorage only — no account, no server.
 * Personal data never leaves the browser.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() =>
    typeof window === 'undefined' ? [] : read(),
  )

  useEffect(() => {
    const onChange = () => setFavorites(read())
    window.addEventListener(EVENT, onChange)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener(EVENT, onChange)
      window.removeEventListener('storage', onChange)
    }
  }, [])

  const toggle = useCallback((slug: string) => {
    const next = read().includes(slug) ? read().filter((s) => s !== slug) : [...read(), slug]
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* storage full or disabled — keep the UI honest and do nothing */
    }
    setFavorites(next)
    window.dispatchEvent(new Event(EVENT))
  }, [])

  const has = useCallback((slug: string) => favorites.includes(slug), [favorites])

  return { favorites, toggle, has }
}
