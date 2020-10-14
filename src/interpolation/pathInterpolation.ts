//@ts-ignore
import * as flubber from 'flubber'
import { IInterpolation } from '../../@types'

export function interpolatePaths(a: string, b: string, { stepSize = false }: IInterpolation.IPathOptions) {
  const getPath = flubber.interpolate(a, b, {
    maxSegmentLength: stepSize,
  })
  return function (t: number) {
    return getPath(t) as string
  }
}
