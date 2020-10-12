import Matrix, { MatrixValues } from '../util/matrix'
import { map } from '../util/math'

export function interpolateMatrix(a: Matrix, b: Matrix) {
  return function (t: number) {
    return Matrix.FROM(...(a.values.map((v, i) => map(t, 0, 1, v, b.values[i])) as MatrixValues))
  }
}
