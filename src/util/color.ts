import colorConvert from 'color-convert'

export class Color {
  public r: number
  public g: number
  public b: number
  public a: number

  constructor(r: number, g: number, b: number, a: number = 255) {
    this.r = Math.floor(r)
    this.g = Math.floor(g)
    this.b = Math.floor(b)
    this.a = Math.floor(a)
  }

  public copy() {
    const { r, g, b, a } = this
    return new Color(r, g, b, a)
  }

  static BLACK = () => new Color(0, 0, 0, 255)
  static WHITE = () => new Color(255, 255, 255, 255)
  static GRAY = () => new Color(127.5, 127.5, 127.5, 255)
  static TRANSPARENT = () => new Color(0, 0, 0, 0)

  static RED = () => new Color(255, 0, 0, 255)
  static GREEN = () => new Color(0, 255, 0, 255)
  static BLUE = () => new Color(0, 0, 255, 255)

  static CYAN = () => new Color(0, 255, 255, 255)
  static YELLOW = () => new Color(255, 255, 0, 255)
  static MAGENTA = () => new Color(255, 0, 255, 255)

  static fromHex(hex: string, alpha: number = 255) {
    const [r, g, b] = colorConvert.hex.rgb(hex)
    return new Color(r, g, b, alpha)
  }

  static random(alpha: boolean = false) {
    return new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255, alpha ? Math.random() * 255 : 255)
  }

  public setTransparency(a: number) {
    this.a = a
    return this
  }

  public toHex() {
    return colorConvert.rgb.hex([this.r, this.g, this.b])
  }

  public toRgba() {
    const { r, g, b, a } = this
    return [r, g, b, a]
  }

  public toCss() {
    const { r, g, b } = this
    return `rgb(${r},${g},${b})`
  }

  public toCssOpacity() {
    return `${this.a / 255}`
  }
}

export default Color
