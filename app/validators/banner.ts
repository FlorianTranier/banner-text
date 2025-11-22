import vine from '@vinejs/vine'

/**
 * Validator to validate the payload when creating
 * a new banner.
 */
export const createBannerValidator = vine.compile(
  vine
    .object({
      text: vine.string().optional(),
      color: vine.string().optional(),
      backgroundColor: vine.string().optional(),
      fontSize: vine.number().optional(),
      fontFamily: vine.string().optional(),
      width: vine.number().optional(),
      height: vine.number().optional(),
      textAlign: vine.enum(['left', 'center', 'right']).optional(),
      textVerticalAlign: vine.enum(['top', 'center', 'bottom']).optional(),
    })
    .optional()
)

/**
 * Validator to validate the payload when updating
 * an existing banner.
 */
export const updateBannerValidator = vine.compile(
  vine.object({
    token: vine.string(),
    text: vine.string().optional(),
    color: vine.string().optional(),
    backgroundColor: vine.string().optional(),
    fontSize: vine.number().optional(),
    fontFamily: vine.string().optional(),
    width: vine.number().optional(),
    height: vine.number().optional(),
    textAlign: vine.enum(['left', 'center', 'right']).optional(),
    textVerticalAlign: vine.enum(['top', 'center', 'bottom']).optional(),
  })
)
