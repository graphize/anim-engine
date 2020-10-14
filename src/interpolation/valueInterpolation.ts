import { map } from '../util/methods'

export function interpolateValue(from: number, to: number) {
  return function (t: number) {
    return map(t, 0, 1, from, to)
  }
}
