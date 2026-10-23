/**
 * Scroll the paint reveal takes, as a share of a viewport height. Tune here:
 * the hero timeline and the pinned section read the same value, so they always
 * stay in step. The reveal starts on the frame the clip reaches full paint and
 * ends when the paint has left through the top of the screen.
 */
export const REVEAL_DESKTOP = 0.6
export const REVEAL_MOBILE = 0.45

export const revealDistance = () =>
  (window.innerHeight || 1) * (window.innerWidth >= 1024 ? REVEAL_DESKTOP : REVEAL_MOBILE)
