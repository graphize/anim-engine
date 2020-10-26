import Color from '../util/color'
import { map } from '../util/methods'
import { IDisplayable } from '../types'
import { interpolateValue } from './valueInterpolation'

function noNaN(a: number[]) {
  return a.map((v) => (isNaN(v) ? 0 : v))
}

export function interpolateColors(da: Color, db: Color) {
  let [ar, ag, ab, aa] = noNaN(da.toRgba())
  let [br, bg, bb, ba] = noNaN(db.toRgba())
  const _r = interpolateValue(ar, br)
  const _g = interpolateValue(ag, bg)
  const _b = interpolateValue(ab, bb)
  const _alpha = interpolateValue(aa, ba)
  return function (t: number) {
    const r = _r(t)
    const g = _g(t)
    const b = _b(t)
    const alpha = _alpha(t)
    return new Color(r, g, b, alpha)
  }
}

export function interpolateBorder(a: IDisplayable.IBorder, b: IDisplayable.IBorder) {
  const color = interpolateColors(a.color, b.color)
  const weight = interpolateValue(a.weight, b.weight)
  const array = interpolateValue(a.array || 0, b.array || 0)
  const offset = interpolateValue(a.offset || 0, b.offset || 0)
  return function (t: number): IDisplayable.IBorder {
    return {
      color: color(t),
      weight: weight(t),
      array: array(t),
      offset: offset(t),
    }
  }
}
