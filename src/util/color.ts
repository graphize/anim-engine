export class Color {
  public r: number
  public g: number
  public b: number
  public a: number

  constructor(r: number, g: number, b: number, a: number) {
    this.r = r
    this.g = r
    this.b = b
    this.a = a
  }

  static BLACK = new Color(0, 0, 0, 1)
  static WHITE = new Color(1, 1, 1, 1)
}

export default Color
