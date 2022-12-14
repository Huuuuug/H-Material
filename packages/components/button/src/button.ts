import type { ExtractPropTypes } from 'vue'

export const buttonTypes = [
  'default',
  'primary',
  'success',
  'warning',
  'danger',
  '',
] as const

export const buttonSize = ['large', 'normal', 'small', 'mini']

export const buttonProps = {
  /**
   * @description button type
   */
  type: {
    type: String,
    values: buttonTypes,
    default: '',
  },
  /**
   * @description button size
   */
  size: buttonSize,
}

export type ButtonProps = ExtractPropTypes<typeof buttonProps>
