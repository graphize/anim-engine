import Color from '../util/color'
import { map } from '../util/math'

export function interpolateColors(_a: Color, _b: Color) {
  const [ah, as, ab, aa] = _a.toHsb()
  const [bh, bs, bb, ba] = _b.toHsb()
  return function (t: number) {
    const h = map(t, 0, 1, ah, bh)
    const s = map(t, 0, 1, as, bs)
    const b = map(t, 0, 1, ab, bb)
    const alpha = map(t, 0, 1, aa, ba)
    return Color.fromHsb(h, s, b, alpha)
  }
}
