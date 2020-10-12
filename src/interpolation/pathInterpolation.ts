//@ts-ignore
import * as flubber from 'flubber'
import { IInterpolation } from '../../@types'

export function interpolate(a: string, b: string, { smoothing = false }: IInterpolation.IPathOptions) {
  const getPath = flubber.interpolate(a, b, {
    maxSegmentLength: smoothing,
  })
  return function (t: number) {
    return getPath(t) as string
  }
}
