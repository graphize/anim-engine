import Vector from './vector'

export type MatrixValues = [number, number, number, number, number, number]

export class Matrix {
  public values: MatrixValues
  constructor() {
    this.values = [1, 0, 0, 1, 0, 0]
  }

  public clone() {
    return Matrix.FROM(...this.values)
    return this
  }

  public translate(vec: Vector) {
    const a = this.values
    const v = vec.values

    const a0 = a[0]
    const a1 = a[1]
    const a2 = a[2]
    const a3 = a[3]
    const a4 = a[4]
    const a5 = a[5]
    const v0 = v[0]
    const v1 = v[1]
    this.values = [a0, a1, a2, a3, a0 * v0 + a2 * v1 + a4, a1 * v0 + a3 * v1 + a5]
    return this
  }

  public scale(vec: Vector) {
    const a0 = this.values[0]
    const a1 = this.values[1]
    const a2 = this.values[2]
    const a3 = this.values[3]
    const a4 = this.values[4]
    const a5 = this.values[5]
    const v0 = vec.values[0]
    const v1 = vec.values[1]

    this.values = [a0 * v0, a1 * v0, a2 * v1, a3 * v1, a4, a5]

    return this
  }

  public rotate(angle: number) {
    const s = Math.sin(angle)
    const c = Math.cos(angle)
    const a0 = this.values[0]
    const a1 = this.values[1]
    const a2 = this.values[2]
    const a3 = this.values[3]
    const a4 = this.values[4]
    const a5 = this.values[5]

    this.values = [a0 * c + a2 * s, a1 * c + a3 * s, a0 * -s + a2 * c, a1 * -s + a3 * c, a4, a5]
    return this
  }

  public add(mat: Matrix) {
    this.values = this.values.map((v, i) => v + mat.values[i]) as MatrixValues
  }

  public substract(mat: Matrix) {
    this.values = this.values.map((v, i) => v - mat.values[i]) as MatrixValues
  }

  public multiply(m: Matrix | number) {
    if (m instanceof Matrix) {
      let a0 = this.values[0],
        a1 = this.values[1],
        a2 = this.values[2],
        a3 = this.values[3],
        a4 = this.values[4],
        a5 = this.values[5]
      let b0 = this.values[0],
        b1 = this.values[1],
        b2 = this.values[2],
        b3 = this.values[3],
        b4 = this.values[4],
        b5 = this.values[5]
      this.values[0] = a0 * b0 + a2 * b1
      this.values[1] = a1 * b0 + a3 * b1
      this.values[2] = a0 * b2 + a2 * b3
      this.values[3] = a1 * b2 + a3 * b3
      this.values[4] = a0 * b4 + a2 * b5 + a4
      this.values[5] = a1 * b4 + a3 * b5 + a5
      return this
    } else {
      this.values = this.values.map((v, i) => v * m) as MatrixValues
    }
  }

  public divide(m: Matrix | number) {
    if (m instanceof Matrix) {
      const _m = m.clone().invert()
      this.multiply(_m)
    } else {
      this.multiply(1 / m)
    }
  }

  public invert() {
    let aa = this.values[0],
      ab = this.values[1],
      ac = this.values[2],
      ad = this.values[3]
    let atx = this.values[4],
      aty = this.values[5]

    let det = this.determinant()
    if (!det) throw `Determinant of a Matrix can't be 0`

    det = 1.0 / det

    this.values[0] = ad * det
    this.values[1] = -ab * det
    this.values[2] = -ac * det
    this.values[3] = aa * det
    this.values[4] = (ac * aty - ad * atx) * det
    this.values[5] = (ab * atx - aa * aty) * det
    return this
  }

  public determinant() {
    return this.values[0] * this.values[3] - this.values[1] * this.values[2]
  }

  static FROM(...values: MatrixValues) {
    const mat = new Matrix()
    mat.values = [...values] as MatrixValues
    return mat
  }

  public toString() {
    const [a, b, c, d, e, f] = this.values
    return `matrix(${a},${b},${c},${d},${e},${f})`
  }
}

export default Matrix
