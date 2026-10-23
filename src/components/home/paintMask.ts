/**
 * Geometry of the supplied paint-drip artwork (`public/img/paint-drip.png`),
 * used as the CSS mask of the hero's paint curtain.
 *
 * The artwork is 1672×941 with the turquoise field on top and the dripping edge
 * reaching down to row 564; everything under that row is transparent, so the
 * paint's lowest point sits at 564 / 941 of the mask's height and the rest is
 * empty padding that the layout has to account for.
 */
export const PAINT_MASK_SRC = '/img/paint-drip.png'

/** Width ÷ height of the artwork; the mask is drawn full-width, never cropped. */
export const PAINT_MASK_ASPECT = 1672 / 941

/** Where the drip tips sit on the artwork, as a share of the mask height. */
export const PAINT_TIP_RATIO = 564 / 941

/**
 * Height of the mask when it spans `width`, and the distance the curtain has to
 * travel for its drip tips to clear the top of a `height`-tall stage.
 */
export const paintMaskHeight = (width: number) => width / PAINT_MASK_ASPECT
export const paintTravel = (width: number, height: number) =>
  height + paintMaskHeight(width) * PAINT_TIP_RATIO
