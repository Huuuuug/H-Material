export type PositionObj = {
  x: number
  y: number
  width: number
  height: number
}

export type FourCornersPositon = {
  startX: number
  startY: number
  endX: number
  endY: number
}

export type CtxDefaultAttributes = {
  LINEWIDTH: number
  STROKESTYLE: string | CanvasGradient | CanvasPattern
  FILLSTYLE: string | CanvasGradient | CanvasPattern
  LINECAP: CanvasLineCap
}
