export type VectorValues = [number, number]

export class Vector {
  public values: VectorValues

  constructor() {
    this.values = [0, 0]
  }

  public add(v: Vector) {
    this.values = this.values.map((val, i) => val + v.values[i]) as VectorValues
  }

  public substract(v: Vector) {
    this.values = this.values.map((val, i) => val - v.values[i]) as VectorValues
  }

  static FROM(...values: VectorValues) {
    const vec = new Vector()
    vec.values = [...values] as VectorValues
    return vec
  }

  static POLAR(θ: number, r: number) {
    return this.FROM(r * Math.cos(θ), r * Math.sin(θ))
  }
}

export default Vector
