/**
 * The paint curtain's artwork (`public/img/paint-drip.png`), drawn full colour:
 * the 3D render is the visible asset, so its highlights, shadows and alpha are
 * kept exactly as supplied — never used as a mask or recoloured.
 *
 * The artwork is 1672×941 with a straight opaque top edge and the dripping edge
 * reaching down to row 571; everything under that is transparent, so the paint's
 * lowest point sits at 571 / 941 of the image height and the padding below it is
 * empty space that the layout has to account for.
 */
export const PAINT_ART_SRC = '/img/paint-drip.png'

/** Width ÷ height of the artwork; it is drawn full-width and never stretched. */
export const PAINT_ART_ASPECT = 1672 / 941

/** Where the drip tips sit on the artwork, as a share of the image height. */
export const PAINT_TIP_RATIO = 571 / 941

/**
 * Turquoise of the artwork's straight upper edge (measured mean of its top
 * rows). The solid plate above the artwork uses it, so the paint reads as one
 * continuous surface from the top of the screen down into the drips.
 */
export const PAINT_EDGE_COLOR = '#0ABDC6'

/** Height of the artwork when it spans `width`. */
export const paintArtHeight = (width: number) => width / PAINT_ART_ASPECT

/**
 * Distance the curtain travels for its drip tips to clear the top of a
 * `height`-tall stage: cover the stage, then carry the artwork itself past it.
 */
export const paintTravel = (width: number, height: number) =>
  height + paintArtHeight(width) * PAINT_TIP_RATIO
