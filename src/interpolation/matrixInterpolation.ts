import Matrix, { MatrixValues } from '../util/matrix'
import { map } from '../util/methods'
import { interpolateValue } from './valueInterpolation'

export function interpolateMatrix(a: Matrix, b: Matrix) {
  const interpolations = a.values.map((v, i) => interpolateValue(v, b.values[i]))
  return function (t: number) {
    return Matrix.FROM(...(interpolations.map((f) => f(t)) as MatrixValues))
  }
}
