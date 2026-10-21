import { useId } from 'react'

export interface RoomDef {
  id: 'living' | 'facade'
  name: string
  note: string
}

export const rooms: RoomDef[] = [
  { id: 'living', name: 'نشیمن', note: 'نور روز از پنجره، دیوار اصلی و قوس' },
  { id: 'facade', name: 'نما', note: 'نمای ساختمان در آفتاب بعدازظهر' },
]

interface RoomSceneProps {
  room: RoomDef['id']
  color: string
  className?: string
}

/**
 * Illustrated room scenes with explicit wall regions. Only those regions are
 * painted with the chosen colour; furniture, glazing and lighting are separate
 * layers, so the preview never recolours the whole scene.
 *
 * This is a drawing, not a photograph: it is presented as an approximation and
 * the UI says so, next to the physical-swatch advice.
 */
export function RoomScene({ room, color, className }: RoomSceneProps) {
  const uid = useId().replace(/:/g, '')
  const light = `light-${uid}`
  const shade = `shade-${uid}`
  const floor = `floor-${uid}`
  const sky = `sky-${uid}`
  const glow = `glow-${uid}`

  if (room === 'facade') {
    return (
      <svg viewBox="0 0 800 620" className={className} role="img" aria-label="پیش‌نمایش نمای ساختمان با رنگ انتخابی">
        <defs>
          <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E4F1F5" />
            <stop offset="100%" stopColor="#F6FAF9" />
          </linearGradient>
          <linearGradient id={light} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#241038" stopOpacity="0.22" />
          </linearGradient>
          <linearGradient id={shade} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#241038" stopOpacity="0.22" />
            <stop offset="45%" stopColor="#241038" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={floor} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#D9CBB6" />
            <stop offset="100%" stopColor="#C7B69D" />
          </linearGradient>
          <radialGradient id={glow} cx="0.18" cy="0.1" r="0.7">
            <stop offset="0%" stopColor="#FFE9A8" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#FFE9A8" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="800" height="620" fill={`url(#${sky})`} />
        <circle cx="140" cy="96" r="120" fill={`url(#${glow})`} />
        <circle cx="140" cy="96" r="34" fill="#FFD447" opacity="0.85" />

        {/* distant skyline */}
        <g fill="#CBD9DC" opacity="0.55">
          <rect x="560" y="230" width="90" height="150" />
          <rect x="660" y="270" width="70" height="110" />
        </g>

        {/* facade wall — the masked surface */}
        <g>
          <rect x="60" y="140" width="620" height="330" fill={color} />
          <rect x="60" y="140" width="620" height="330" fill={`url(#${light})`} style={{ mixBlendMode: 'soft-light' }} />
          <rect x="60" y="140" width="620" height="330" fill={`url(#${shade})`} style={{ mixBlendMode: 'multiply' }} opacity="0.55" />
          {/* cornice */}
          <rect x="48" y="126" width="644" height="16" rx="3" fill="#FFFDF8" />
          <rect x="48" y="462" width="644" height="10" rx="3" fill="#FFFDF8" opacity="0.9" />
        </g>

        {/* windows and door */}
        <g>
          <rect x="110" y="205" width="150" height="180" rx="4" fill="#FFFDF8" />
          <rect x="120" y="215" width="130" height="160" rx="2" fill="#9EC9D6" />
          <path d="M185 215v160M120 295h130" stroke="#FFFDF8" strokeWidth="6" />
          <rect x="480" y="205" width="150" height="180" rx="4" fill="#FFFDF8" />
          <rect x="490" y="215" width="130" height="160" rx="2" fill="#9EC9D6" />
          <path d="M555 215v160M490 295h130" stroke="#FFFDF8" strokeWidth="6" />
          <path d="M330 470v-120a40 40 0 0 1 80 0v120Z" fill="#2F5BEA" opacity="0.85" />
          <path d="M344 470v-116a26 26 0 0 1 52 0v116Z" fill="#FFFDF8" opacity="0.35" />
        </g>

        {/* ground */}
        <rect y="470" width="800" height="150" fill={`url(#${floor})`} />
        <path d="M60 470h620l70 34H0Z" fill="#241038" opacity="0.12" />

        {/* planter */}
        <g>
          <path d="M690 470c-14-40-12-70 4-96 16 26 18 56 4 96Z" fill="#3F7D5E" />
          <path d="M700 470c10-36 30-54 56-60-10 30-28 50-56 60Z" fill="#4C8F6B" />
          <rect x="672" y="470" width="56" height="34" rx="6" fill="#C97C5B" />
        </g>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 800 620" className={className} role="img" aria-label="پیش‌نمایش نشیمن با رنگ انتخابی روی دیوار">
      <defs>
        <linearGradient id={light} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#241038" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id={shade} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#241038" stopOpacity="0.26" />
          <stop offset="60%" stopColor="#241038" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id={floor} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E7D8C1" />
          <stop offset="100%" stopColor="#D3BFA2" />
        </linearGradient>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DCF0F4" />
          <stop offset="100%" stopColor="#F5FBFA" />
        </linearGradient>
      </defs>

      {/* wall — the masked surface */}
      <g>
        <rect width="800" height="472" fill={color} />
        <rect width="800" height="472" fill={`url(#${light})`} style={{ mixBlendMode: 'soft-light' }} />
        <rect width="800" height="472" fill={`url(#${shade})`} style={{ mixBlendMode: 'multiply' }} opacity="0.7" />
      </g>

      {/* arch detail painted on the same wall surface */}
      <g style={{ mixBlendMode: 'multiply' }} opacity="0.16" fill="#241038">
        <path d="M600 472V210a80 80 0 0 1 160 0v262Z" />
      </g>
      <path d="M600 472V210a80 80 0 0 1 160 0v262" fill="none" stroke="#FFFDF8" strokeWidth="6" opacity="0.75" />

      {/* floor */}
      <rect y="472" width="800" height="148" fill={`url(#${floor})`} />
      <path d="M0 472h800v14H0Z" fill="#FFFDF8" opacity="0.55" />

      {/* window with daylight */}
      <g>
        <rect x="70" y="110" width="200" height="250" rx="6" fill="#FFFDF8" />
        <rect x="82" y="122" width="176" height="226" rx="3" fill={`url(#${sky})`} />
        <path d="M170 122v226M82 235h176" stroke="#FFFDF8" strokeWidth="7" />
        <path d="M82 348h176v0-226" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.7" />
        {/* sunlight spill */}
        <path d="M82 348h176l150 124H70Z" fill="#FFF3CC" opacity="0.5" />
      </g>

      {/* artwork on the wall */}
      <g>
        <rect x="330" y="120" width="150" height="120" rx="4" fill="#FFFDF8" />
        <rect x="342" y="132" width="126" height="96" fill="#FFD447" opacity="0.9" />
        <circle cx="405" cy="180" r="34" fill="#FF777C" />
      </g>

      {/* sofa */}
      <g>
        <ellipse cx="500" cy="536" rx="210" ry="22" fill="#241038" opacity="0.14" />
        <rect x="330" y="392" width="330" height="104" rx="18" fill="#F4EADB" />
        <rect x="330" y="360" width="330" height="60" rx="16" fill="#FBF3E6" />
        <path d="M356 360v100M634 360v100" stroke="#E4D5C0" strokeWidth="3" />
        <rect x="360" y="408" width="120" height="56" rx="10" fill="#EFE2CF" />
        <rect x="500" y="408" width="120" height="56" rx="10" fill="#EFE2CF" />
        <rect x="352" y="492" width="14" height="24" rx="4" fill="#B79A78" />
        <rect x="624" y="492" width="14" height="24" rx="4" fill="#B79A78" />
      </g>

      {/* cobalt accent chair */}
      <g>
        <ellipse cx="222" cy="532" rx="86" ry="16" fill="#241038" opacity="0.14" />
        <rect x="152" y="398" width="140" height="104" rx="20" fill="#2F5BEA" />
        <rect x="152" y="382" width="140" height="46" rx="18" fill="#3E68F0" />
        <rect x="164" y="496" width="12" height="22" rx="4" fill="#8A6B4E" />
        <rect x="268" y="496" width="12" height="22" rx="4" fill="#8A6B4E" />
      </g>

      {/* plant */}
      <g>
        <path d="M74 452c-16-46-12-80 6-108 18 30 20 66 4 108Z" fill="#3F7D5E" />
        <path d="M86 452c12-40 34-60 62-66-12 34-32 56-62 66Z" fill="#4C8F6B" />
        <rect x="56" y="452" width="64" height="34" rx="6" fill="#C97C5B" />
      </g>

      {/* coffee table */}
      <g>
        <rect x="392" y="510" width="180" height="12" rx="6" fill="#B08A63" />
        <rect x="410" y="522" width="8" height="26" fill="#B08A63" />
        <rect x="546" y="522" width="8" height="26" fill="#B08A63" />
      </g>
    </svg>
  )
}
