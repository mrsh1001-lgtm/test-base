/** Samples along the width for the liquid edge. */
const SAMPLES = 44

/**
 * Drips hanging from the edge, as the reference shows: a row of rounded
 * teardrops that all point down, two of them noticeably longer.
 * `x` is a share of the width; `r` (half-width) and `len` are shares of the height.
 */
const DRIPS = [
  { x: 0.06, r: 0.009, len: 0.044 },
  { x: 0.19, r: 0.018, len: 0.082 },
  { x: 0.33, r: 0.01, len: 0.03 },
  { x: 0.46, r: 0.014, len: 0.058 },
  { x: 0.6, r: 0.021, len: 0.118 },
  { x: 0.73, r: 0.011, len: 0.036 },
  { x: 0.86, r: 0.016, len: 0.092 },
  { x: 0.96, r: 0.008, len: 0.028 },
]

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value)

/** Height of the liquid edge at a share `t` of the width. */
const edgeAt = (t: number, base: number, amplitude: number) =>
  base +
  amplitude *
    (Math.sin(t * 9.1 + 0.6) * 0.5 + Math.sin(t * 15.7 + 2.3) * 0.3 + Math.sin(t * 5.3 + 4.4) * 0.2)

/** One drip: a rounded teardrop that hangs down from the edge and melts into it. */
const dripPath = (cx: number, edge: number, radius: number, length: number) => {
  const top = edge - radius
  const shoulder = top + Math.max(length, radius * 2) - radius
  const left = (cx - radius).toFixed(1)
  const right = (cx + radius).toFixed(1)
  return `M${left} ${top.toFixed(1)}L${left} ${shoulder.toFixed(1)}A${radius.toFixed(1)} ${radius.toFixed(
    1,
  )} 0 0 0 ${right} ${shoulder.toFixed(1)}L${right} ${top.toFixed(1)}Z`
}

export type PaintEdge = { mass: string; drips: string }

/**
 * The paint mass for the reveal, in the shape of the reference: attached to the
 * top of the screen with an organic lower boundary and drips pointing down.
 *
 * Progress 0 keeps the boundary below the viewport (the paint covers everything),
 * progress 1 has carried it above the top edge, so the paint has left through
 * the top and the section underneath is fully exposed.
 */
export function paintEdge(width: number, height: number, progress: number): PaintEdge {
  const pad = Math.max(160, height * 0.28)
  const value = clamp01(progress)
  const base = height + pad - (height + pad * 2) * value
  const amplitude = Math.min(26, height * 0.04) * Math.sin(Math.PI * value)

  let mass = `M0 ${edgeAt(0, base, amplitude).toFixed(1)}`
  for (let index = 1; index <= SAMPLES; index += 1) {
    const t0 = (index - 1) / SAMPLES
    const t1 = index / SAMPLES
    const mid = ((t0 + t1) / 2) * width
    mass += ` C${mid.toFixed(1)} ${edgeAt(t0, base, amplitude).toFixed(1)}, ${mid.toFixed(
      1,
    )} ${edgeAt(t1, base, amplitude).toFixed(1)}, ${(t1 * width).toFixed(1)} ${edgeAt(
      t1,
      base,
      amplitude,
    ).toFixed(1)}`
  }
  // Close over the top edge: the paint is attached to the top of the screen.
  mass += ` L${width} 0 L0 0 Z`

  let drips = ''
  for (const drip of DRIPS) {
    const radius = Math.max(6, height * drip.r)
    drips += dripPath(drip.x * width, edgeAt(drip.x, base, amplitude), radius, height * drip.len)
  }

  return { mass, drips }
}
