//@ts-ignore
import * as flubber from 'flubber'
import { IInterpolation } from '../types'

export function interpolatePaths(a: string, b: string, { stepSize = false }: IInterpolation.IPathOptions) {
  if (a.length === 0 && b.length === 0)
    return function (t: number) {
      return ''
    }
  if (a === b)
    return function (t: number) {
      return a
    }

  try {
    const getPath = flubber.interpolate(a, b, {
      maxSegmentLength: 0.1,
    })
    return function (t: number) {
      return getPath(t) as string
    }
  } catch (e) {
    console.error(`Path is not well formated`)
    console.error(`"${a}"`)
    console.error(`"${b}"`)
    throw e
  }
}
