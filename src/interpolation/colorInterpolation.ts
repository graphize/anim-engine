import Color from '../util/color'
import { map } from '../util/methods'
import { IDisplayable } from '../types'
import { interpolateValue } from './valueInterpolation'

function noNaN(a: number[]) {
  return a.map((v) => (isNaN(v) ? 0 : v))
}

export function interpolateColors(da: Color, db: Color) {
  let [ah, as, ab, aa] = noNaN(da.toHsb())
  let [bh, bs, bb, ba] = noNaN(db.toHsb())
  const _h = interpolateValue(ah, bh)
  const _s = interpolateValue(as, bs)
  const _b = interpolateValue(ab, bb)
  const _alpha = interpolateValue(aa, ba)
  return function (t: number) {
    const h = _h(t)
    const s = _s(t)
    const b = _b(t)
    const alpha = _alpha(t)
    return Color.fromHsb(h, s, b, alpha)
  }
}

export function interpolateBorder(a: IDisplayable.IBorder, b: IDisplayable.IBorder) {
  const color = interpolateColors(a.color, b.color)
  const weight = interpolateValue(a.weight, b.weight)
  return function (t: number): IDisplayable.IBorder {
    return {
      color: color(t),
      weight: weight(t),
    }
  }
}
