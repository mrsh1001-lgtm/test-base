import ambientColors from '../../data/hero-ambient.json'

/**
 * Prepared frame sequence for the hero campaign clip.
 *
 * The supplied asset is a 10 s / 24 fps H.264 clip (640×360). Seeking a
 * compressed H.264 file on every scroll event stutters and drops frames, so the
 * clip is exported once to a numbered JPEG sequence: the hero addresses an exact
 * frame from scroll progress and drawing a decoded image is cheap in both
 * directions. Assets live in `public/hero` and were generated from the clip with
 * `ffmpeg -fps_mode passthrough -q:v 3`.
 */
export const FRAME_COUNT = 240

/** Frames are 1-based on disk: f001.jpg … f240.jpg */
export const frameSrc = (index: number) => `/hero/f${String(index + 1).padStart(3, '0')}.jpg`

/** First frame, shown immediately so the stage is never empty while loading. */
export const POSTER_SRC = '/hero/poster.jpg'

/**
 * Dominant colour of the clip's final frame (measured mean of the last frame:
 * rgb(42,169,180)). It is the shared token for the stage behind the media, the
 * final hero overlay, the paint curtain and the first content section.
 */
export const PAINT_COLOR = '#2AA9B4'

/** Colour of the clip's outer edge per frame, used to blend the media into the page. */
export const AMBIENT_COLORS: string[] = ambientColors

type Options = { concurrency?: number; limit?: number }

/**
 * Progressive, scroll-aware frame loader.
 *
 * Frames are requested in the order the user is travelling (the playhead first,
 * then ahead of it) and the whole sequence is filled in afterwards at a low
 * concurrency, so a slow connection still gets a populated sequence without
 * blocking the first paint. A bounded cache drops frames far from the playhead
 * to keep mobile memory in check; the browser's HTTP cache keeps the bytes.
 */
export class FrameSequence {
  private images: Array<HTMLImageElement | undefined> = []
  private pending = new Set<number>()
  private queue: number[] = []
  private active = 0
  private disposed = false

  private readonly concurrency: number
  private readonly limit: number

  /** Called whenever a requested frame finishes decoding. */
  onReady: ((index: number) => void) | null = null

  constructor({ concurrency = 5, limit = 240 }: Options = {}) {
    this.concurrency = concurrency
    this.limit = limit
  }

  get(index: number): HTMLImageElement | undefined {
    return this.images[index]
  }

  get loadedCount() {
    return this.images.reduce((total, image) => (image ? total + 1 : total), 0)
  }

  /** Queue one frame; `urgent` puts it at the front of the line. */
  enqueue(index: number, urgent = false) {
    if (this.disposed || index < 0 || index >= FRAME_COUNT) return
    if (this.images[index] || this.pending.has(index) || this.queue.includes(index)) return
    if (urgent) this.queue.unshift(index)
    else this.queue.push(index)
    this.pump()
  }

  /** Queue the frames ahead of the playhead first, in travel order. */
  prefetch(center: number, direction: 1 | -1, ahead = 24) {
    if (this.disposed) return
    const upcoming: number[] = []
    for (let step = 1; step <= ahead; step += 1) {
      const index = center + step * direction
      if (index < 0 || index >= FRAME_COUNT) break
      if (this.images[index] || this.pending.has(index)) continue
      upcoming.push(index)
    }
    if (!upcoming.length) return
    this.queue = [...upcoming, ...this.queue.filter((index) => !upcoming.includes(index))]
    this.pump()
  }

  /** Fill in every frame that is still missing, without competing with the playhead. */
  fill() {
    for (let index = 0; index < FRAME_COUNT; index += 1) this.enqueue(index)
  }

  /** Release frames furthest from the playhead once the cache budget is exceeded. */
  trim(center: number) {
    if (this.loadedCount <= this.limit) return
    const loaded: number[] = []
    for (let index = 0; index < FRAME_COUNT; index += 1) {
      if (this.images[index]) loaded.push(index)
    }
    loaded.sort((a, b) => Math.abs(b - center) - Math.abs(a - center))
    const excess = loaded.length - this.limit
    for (let index = 0; index < excess; index += 1) this.images[loaded[index]] = undefined
  }

  private pump() {
    while (this.active < this.concurrency && this.queue.length) {
      const index = this.queue.shift() as number
      if (this.images[index] || this.pending.has(index)) continue

      this.active += 1
      this.pending.add(index)

      const image = new Image()
      image.decoding = 'async'
      image.onload = () => {
        this.active -= 1
        this.pending.delete(index)
        if (this.disposed) return
        this.images[index] = image
        this.onReady?.(index)
        this.pump()
      }
      image.onerror = () => {
        this.active -= 1
        this.pending.delete(index)
        this.pump()
      }
      image.src = frameSrc(index)
    }
  }

  dispose() {
    this.disposed = true
    this.onReady = null
    this.images = []
    this.pending.clear()
    this.queue = []
  }
}
