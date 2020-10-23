import Matrix from './matrix'
import { TAU } from '../main'

export type VectorValues = [number, number]

export class Vector {
  public values: VectorValues

  constructor() {
    this.values = [0, 0]
  }

  public copy() {
    const [x, y] = this.values
    return Vector.FROM(x, y)
  }

  public add(v: Vector) {
    this.values = this.values.map((val, i) => val + v.values[i]) as VectorValues
    return this
  }

  public substract(v: Vector) {
    this.values = this.values.map((val, i) => val - v.values[i]) as VectorValues
    return this
  }

  public magSq() {
    const [x, y] = this.values
    return x * x + y * y
  }

  public mag() {
    return Math.sqrt(this.magSq())
  }

  public mult(c: number) {
    this.values = this.values.map((v) => v * c) as VectorValues
    return this
  }

  public div(c: number) {
    this.mult(1 / c)
    return this
  }

  public invert() {
    this.values = this.values.map((v) => 1 / v) as VectorValues
    return this
  }

  public applyMatrix(m: Matrix) {
    const x = this.values[0]
    const y = this.values[1]
    this.values[0] = m.values[0] * x + m.values[2] * y + m.values[4]
    this.values[1] = m.values[1] * x + m.values[3] * y + m.values[5]
    return this.values
  }

  static FROM(...values: VectorValues) {
    const vec = new Vector()
    vec.values = [...values] as VectorValues
    return vec
  }

  static POLAR(θ: number, r: number) {
    return this.FROM(r * Math.cos(θ), r * Math.sin(θ))
  }

  static RANDOM(θ: number = Math.random() * TAU, r: number = Math.random() * 5) {
    return this.POLAR(θ, r)
  }
}

export default Vector
