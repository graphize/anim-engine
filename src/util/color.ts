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

  static BLACK = new Color(0, 0, 0, 255)
  static WHITE = new Color(255, 255, 255, 255)

  static fromHex(hex: string) {
    let alpha = false
    let h = hex.slice(hex.startsWith('#') ? 1 : 0)
    if (h.length === 3) hex = [...h.split('')].map((x) => x + x).join('')
    else if (h.length === 8) alpha = true
    let c = parseInt(h, 16)
    return new Color(
      c >>> (alpha ? 24 : 16),
      (c & (alpha ? 0x00ff0000 : 0x00ff00)) >>> (alpha ? 16 : 8),
      (c & (alpha ? 0x0000ff00 : 0x0000ff)) >>> (alpha ? 8 : 0),
      c & 0x000000ff || 255
    )
  }

  static fromHsl(h: number, s: number, l: number, alpha: number = 255) {
    s /= 100
    l /= 100
    const k = (n: number) => (n + h / 30) % 12
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return new Color(255 * f(0), 255 * f(8), 255 * f(4), alpha)
  }

  static fromHsb(h: number, s: number, b: number, alpha: number = 255) {
    s /= 100
    b /= 100
    const k = (n: number) => (n + h / 60) % 6
    const f = (n: number) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)))
    return new Color(255 * f(5), 255 * f(3), 255 * f(1), alpha)
  }

  static random(alpha: boolean = false) {
    return new Color(Math.random() * 255, Math.random() * 255, Math.random() * 255, alpha ? Math.random() * 255 : 255)
  }

  public toHex() {
    const { r, g, b } = this
    return `#${((r << 16) + (g << 8) + b).toString(16).padStart(6, '0')}`
  }

  public toHsl() {
    let { r, g, b } = this
    r /= 255
    g /= 255
    b /= 255
    const l = Math.max(r, g, b)
    const s = l - Math.min(r, g, b)
    const h = s ? (l === r ? (g - b) / s : l === g ? 2 + (b - r) / s : 4 + (r - g) / s) : 0
    return [60 * h < 0 ? 60 * h + 360 : 60 * h, 100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0), (100 * (2 * l - s)) / 2, this.a]
  }

  public toHsb() {
    let { r, g, b } = this
    r /= 255
    g /= 255
    b /= 255
    const v = Math.max(r, g, b),
      n = v - Math.min(r, g, b)
    const h = n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n
    return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100, this.a]
  }

  public toRgba() {
    const { r, g, b, a } = this
    return [r, g, b, a]
  }
}

export default Color
