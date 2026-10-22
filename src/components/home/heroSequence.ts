import ambientColors from '../../data/hero-ambient.json'

/**
 * Prepared frame sequence for the hero campaign animation.
 *
 * The supplied asset is a 10 s / 24 fps clip (640×360). It is exported once to
 * a numbered JPEG sequence so the hero can address exact frames from scroll
 * progress — seeking a compressed H.264 file per scroll event stutters, while
 * drawing a pre-decoded image is cheap and reversible.
 */
export const FRAME_COUNT = 240

/** Frames are 1-based on disk: f001.jpg … f240.jpg */
export const frameSrc = (index: number) => `/hero/f${String(index + 1).padStart(3, '0')}.jpg`

export const POSTER_SRC = '/hero/poster.jpg'

/** Dominant colour of the final frame — the paint that covers the site. */
export const PAINT_COLOR = '#2CACB7'

/** Average colour of every frame, used as the ambient field behind the video. */
export const AMBIENT_COLORS: string[] = ambientColors

const MAX_CACHED_FRAMES = 150

/**
 * Bounded, progressive frame loader.
 *
 * Frames load on demand in the direction of travel; the cache drops the frames
 * furthest from the playhead so a long sequence never pins hundreds of decoded
 * bitmaps in memory on a phone.
 */
export class FrameStore {
  private frames: Array<HTMLImageElement | undefined> = []
  private pending = new Set<number>()
  private disposed = false

  /** Called whenever a requested frame finishes decoding. */
  onFrameReady: ((index: number) => void) | null = null

  get(index: number): HTMLImageElement | undefined {
    return this.frames[index]
  }

  request(index: number) {
    if (this.disposed || index < 0 || index >= FRAME_COUNT) return
    if (this.frames[index] || this.pending.has(index)) return

    this.pending.add(index)
    const image = new Image()
    image.decoding = 'async'
    image.src = frameSrc(index)
    image.onload = () => {
      this.pending.delete(index)
      if (this.disposed) return
      this.frames[index] = image
      this.onFrameReady?.(index)
    }
    image.onerror = () => {
      this.pending.delete(index)
    }
  }

  /** Queue the frames ahead of the playhead without flooding the network. */
  prefetch(center: number, direction: 1 | -1, ahead = 16, concurrency = 5) {
    let queued = 0
    for (let step = 1; step <= ahead && queued < concurrency; step += 1) {
      const index = center + step * direction
      if (index < 0 || index >= FRAME_COUNT) continue
      if (this.frames[index] || this.pending.has(index)) continue
      this.request(index)
      queued += 1
    }
  }

  /**
   * Warm a coarse ladder of frames (plus the final one) so a fast scroll or a
   * jump to the end still has a nearby frame to draw immediately.
   */
  warmKeyframes(step = 24) {
    for (let index = 0; index < FRAME_COUNT; index += step) this.request(index)
    this.request(FRAME_COUNT - 1)
  }

  /** Release frames far away from the playhead. */
  trim(center: number, limit = MAX_CACHED_FRAMES) {
    const loaded: number[] = []
    for (let i = 0; i < FRAME_COUNT; i += 1) {
      if (this.frames[i]) loaded.push(i)
    }
    if (loaded.length <= limit) return

    loaded.sort((a, b) => Math.abs(b - center) - Math.abs(a - center))
    const excess = loaded.length - limit
    for (let i = 0; i < excess; i += 1) this.frames[loaded[i]] = undefined
  }

  dispose() {
    this.disposed = true
    this.onFrameReady = null
    this.frames = []
    this.pending.clear()
  }
}
