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
}

export type ButtonProps = ExtractPropTypes<typeof buttonProps>
