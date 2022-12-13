// 这里放组件的props及公共方法
import type { ExtractPropTypes } from "vue";
//  as const，会让对象的每个属性变成只读（readonly）
export const iconProps = {
  /**
   * @description SVG icon size, size x size
   */
  size: {
    type: Number,
  },
  /**
   * @description SVG tag's fill attribute
   */
  color: {
    type: String,
  },
} as const;

export type IconProps = ExtractPropTypes<typeof iconProps>;
