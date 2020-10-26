import { Displayable } from '../displayables'
import { flat } from '../util/array'
import { IInterpolation } from '../types'
import { interpolatePaths } from './pathInterpolation'
import { interpolateMatrix } from './matrixInterpolation'
import { interpolateColors, interpolateBorder } from './colorInterpolation'
import { interpolateValue } from './valueInterpolation'

export function interpolateProperties(a: Displayable, b: Displayable, opts: IInterpolation.IPathOptions = {}) {
  const mat = interpolateMatrix(a.mat, b.mat)
  const path = interpolatePaths(a.path, b.path, opts)
  const fill = interpolateColors(a.fill, b.fill)
  const opacity = interpolateValue(a.opacity, b.opacity)
  const border = interpolateBorder(a.border, b.border)
  return function (t: number) {
    return new Displayable({
      ...a,
      mat: mat(t),
      path: path(t),
      fill: fill(t),
      border: border(t),
      opacity: opacity(t),
    })
  }
}

export function interpolateDisplayable(a: Displayable, b: Displayable, opts: IInterpolation.IPathOptions = {}): IInterpolation.IAnimatorPath[] {
  const pathsA = extractDisplayables(a)
  const pathsB = extractDisplayables(b)

  if (pathsA.length === pathsB.length) {
    return pathsA.map((displayable, i) => ({
      displayableA: displayable,
      displayableB: pathsB[i],
      animator: interpolateProperties(displayable, pathsB[i], opts),
    }))
  } else if (pathsA.length > pathsB.length) {
    return pathsA.map((displayable, i) =>
      pathsB[i]
        ? {
            displayableA: displayable,
            displayableB: pathsB[i],
            animator: interpolateProperties(displayable, pathsB[i], opts),
          }
        : {
            displayableA: displayable,
            displayableB: pathsB[pathsB.length - 1],
            animator: interpolateProperties(displayable, pathsB[pathsB.length - 1], opts),
          }
    )
  } else {
    // pathsA.length < pathsB.length
    return pathsB.map((displayable, i) =>
      pathsA[i]
        ? {
            displayableA: pathsA[i],
            displayableB: displayable,
            animator: interpolateProperties(pathsA[i], displayable, opts),
          }
        : {
            displayableA: pathsA[pathsA.length - 1],
            displayableB: displayable,
            animator: interpolateProperties(pathsA[pathsA.length - 1], displayable, opts),
          }
    )
  }
}

function extractDisplayables(d: Displayable) {
  return flat<Displayable>(extractDisplayablesFrom(d))
}

function extractDisplayablesFrom(displayable: Displayable): any {
  const { subdisplayables } = displayable
  const paths: any = []
  paths.push(displayable)
  paths.push(...subdisplayables.map((c) => extractDisplayablesFrom(c)))
  return paths
}
