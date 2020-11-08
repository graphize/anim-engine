import { ARC_POINTS_COUNT, Rectangle, Line, Triangle, Circle } from './geometry'
import { IDisplayable } from '../types'
import { Vector, map, Matrix, Color } from '../util'
import { PI } from '../main'
import Displayable, { Group } from './displayable'
import { interpolateColors, interpolateBorder } from '../interpolation/colorInterpolation'

// TODO Render hyperbolas (currently impossible)
export function generatePointsFromFunction(f: (x: number) => number, minMax: IDisplayable.IXYRange, pointsCount: number) {
  const xMin = minMax.x.min
  const xMax = minMax.x.max
  const yMin = minMax.y.min
  const yMax = minMax.y.max
  const xInc = (xMax - xMin) / pointsCount
  const points: Vector[] = []

  function inRange(y: number) {
    return y >= yMin && y <= yMax
  }

  for (let x = xMin; x < xMax; x += xInc) {
    const y = f(x)

    if (!isNaN(y) && inRange(y)) {
      const v = Vector.FROM(map(x, xMin, xMax, -5, 5), map(y, yMin, yMax, 5, -5))
      points.push(v)
    }
  }

  return points
}

function generatePathFromPoints(points: Vector[]) {
  return (
    points.map(({ values }, i) => `${i === 0 ? 'M' : 'L'} ${values[0]} ${values[1]}`).join(' ') +
    points
      .reverse()
      .map(({ values }, i) => `L ${values[0]} ${values[1]}`)
      .join(' ') +
    ' Z'
  )
}

const noBorder: IDisplayable.IBorder = { weight: 0, color: Color.TRANSPARENT() }

export class Graph extends Group {
  public minMax: IDisplayable.IXYRange
  public pointsCount: number
  public color: Color

  constructor({ minMax, color = Color.BLACK(), doc, mat, pointsCount = ARC_POINTS_COUNT, arrows = true }: IDisplayable.IGraph.IGraphParams) {
    super({ displayables: [], doc, mat })
    this.minMax = minMax
    this.addAxis(arrows, color)
    this.pointsCount = pointsCount
    this.color = color
  }

  private getArrow(pos: Vector, r: number = 0, mat: Matrix, direction: 'TOP' | 'LEFT' = 'TOP') {
    const triangle = new Triangle({
      width: 0.5,
      mat: mat.clone(),
      fill: Color.TRANSPARENT(),
      border: { weight: 1, color: Color.BLACK() },
      doc: this.doc,
    })
    triangle.translate(pos)
    triangle.scale(direction === 'LEFT' ? Vector.FROM(0.75, 1) : Vector.FROM(1, 0.75))
    triangle.rotate(r)
    return triangle
  }

  private _round(v: number) {
    if (v < 0) return Math.floor(v)
    else return Math.ceil(v)
  }

  private round({ max, min, interval }: IDisplayable.IMinMax): IDisplayable.IMinMax {
    max = this._round(max)
    min = this._round(min)
    return { max, min, interval }
  }

  private addTicks(axis: 'x' | 'y', color: Color) {
    const border: IDisplayable.IBorder = { color, weight: 3 }
    const { max, min, interval = 1 } = this.round(this.minMax[axis])

    const d = 0.1

    if (axis === 'x')
      for (let i = min; i < max; i += interval) {
        const v = map(i, min, max, -5, 5)

        const from = Vector.FROM(v, d)
        const to = Vector.FROM(v, -d)
        const l = new Line({ from, to, border })
        this.add(l)
      }
    else
      for (let i = max; i > min; i -= interval) {
        const v = map(i, min, max, -5, 5)

        const from = Vector.FROM(d, v)
        const to = Vector.FROM(-d, v)
        const l = new Line({ from, to, border })
        this.add(l)
      }
  }

  // Get graph pos
  public getCoords(x: number, y: number) {
    if (!this.inRange(x, 'x')) throw `x=${x} not in range of the graph`
    if (!this.inRange(y, 'y')) throw `y=${y} not in range of the graph`

    const xMin = this.minMax.x.min
    const xMax = this.minMax.x.max
    const yMin = this.minMax.y.min
    const yMax = this.minMax.y.max
    const v = Vector.FROM(map(x, xMin, xMax, -5, 5), map(y, yMin, yMax, 5, -5))
    return v
  }

  // Get display pos
  public getPosition(x: number, y: number) {
    const xMin = this.minMax.x.min
    const xMax = this.minMax.x.max
    const yMin = this.minMax.y.min
    const yMax = this.minMax.y.max
    const v = Vector.FROM(map(x, -5, 5, xMin, xMax), map(y, 5, -5, yMin, yMax))
    return v
  }

  // TODO Add ticks and labels
  private addAxis(arrows: boolean, color: Color) {
    const border: IDisplayable.IBorder = { color, weight: 3 }
    const xAxis = new Line({ from: Vector.FROM(-5, 0), to: Vector.FROM(5, 0), mat: this.mat.clone(), border, doc: this.doc })
    const yAxis = new Line({ from: Vector.FROM(0, -5), to: Vector.FROM(0, 5), mat: this.mat.clone(), border, doc: this.doc })

    if (arrows) {
      const arrowX = this.getArrow(Vector.FROM(0, -5.1), 0, this.mat, 'LEFT').setBorder(border)
      const arrowY = this.getArrow(Vector.FROM(5.1, 0), PI / 2, this.mat).setBorder(border)
      this.add(arrowX, arrowY)
    }

    this.add(xAxis, yAxis)

    this.addTicks('x', color)
    this.addTicks('y', color)
  }

  private inRange(x: number, axis: keyof IDisplayable.IXYRange = 'x') {
    const { max, min } = this.minMax[axis]
    return x >= min && x <= max
  }

  public graphFunction(f: (x: number) => number, df: (x: number) => number = (x) => x) {
    const { minMax, mat, doc, pointsCount, color, opacity } = this
    const border: IDisplayable.IBorder = { color, weight: 3 }
    const fill = Color.TRANSPARENT()
    const func = new FunctionGraph({
      f,
      minMax,
      border,
      mat,
      graph: this,
      doc,
      fill,
      pointsCount,
      opacity,
      df,
    })
    return func
  }
}

function roundXYRange(range: IDisplayable.IXYRange) {
  function _round(v: number) {
    if (v < 0) return Math.floor(v)
    else return Math.ceil(v)
  }

  const x: IDisplayable.IMinMax = { max: _round(range.x.max), min: _round(range.x.min) }
  const y: IDisplayable.IMinMax = { max: _round(range.y.max), min: _round(range.y.min) }
  return { x, y }
}

export class FunctionGraph extends Displayable {
  public minMax: IDisplayable.IXYRange
  public f: (x: number) => number
  public df: (x: number) => number
  public pointsCount: number
  public parent: Graph

  constructor({ f, minMax, border, mat, opacity, pointsCount, doc, graph, df }: IDisplayable.IGraph.IFunctionGraphParams) {
    minMax = roundXYRange(minMax)
    const points = generatePointsFromFunction(f, minMax, pointsCount)
    const path = generatePathFromPoints(points)
    super({ border, fill: Color.TRANSPARENT(), mat, opacity, path, doc })
    this.f = f
    this.df = df
    this.pointsCount = pointsCount
    this.parent = graph
    this.minMax = minMax
  }

  // TODO Add fill color gradient
  public getRiemannRectangles({
    count,
    minMax = this.minMax.x,
    positiveOnly = false,
    fillGradient = [Color.BLACK(), Color.BLACK()],
    borderGradient = [noBorder, noBorder],
  }: IDisplayable.IGraph.IRiemannRectanglesParams) {
    const inc = (minMax.max - minMax.min) / count
    const rectangles: Rectangle[] = []
    const xMin = this.minMax.x.min
    const xMax = this.minMax.x.max
    const yMin = this.minMax.y.min
    const yMax = this.minMax.y.max
    const width = map(inc, xMin, xMax, -5, 5)
    const fillInterpolator = interpolateColors(...fillGradient)
    const borderInterpolator = interpolateBorder(...borderGradient)
    for (let x = minMax.min; x < minMax.max; x += inc) {
      const y = this.f(x)
      if (!isNaN(y) && !(positiveOnly && y < 0)) {
        const height = map(y, yMin, yMax, -5, 5)
        const mat = this.mat.clone()
        const r = new Rectangle({ width, height, mat, doc: this.doc })
        r.translate(Vector.FROM(map(x, xMin, xMax, -5, 5) + width / 2, map(y, yMin, yMax, 5, -5) + height / 2))
        const t = map(x, minMax.min, minMax.max, 0, 1)
        r.setFill(fillInterpolator(t))
        r.setBorder(borderInterpolator(t))
        rectangles.push(r)
      }
    }
    return rectangles
  }

  private inRange(x: number, axis: keyof IDisplayable.IXYRange = 'x') {
    const { max, min } = this.minMax[axis]
    return x >= min && x <= max
  }

  // TODO Add derivative / tangent
  public getTangentLineAt(a: number, length: number = 3) {
    if (!this.inRange(a)) throw `Point at ${a} not in range of the function`

    const xMin = this.minMax.x.min
    const xMax = this.minMax.x.max
    const yMin = this.minMax.y.min
    const yMax = this.minMax.y.max

    // Tangent function
    const t = (_x: number) => this.df(a) * (_x - a) + this.f(a)
    const i = a - 1
    const j = a + 1
    const M = Vector.FROM(map(a, xMin, xMax, -5, 5), map(t(a), yMin, yMax, 5, -5))
    const I = Vector.FROM(map(i, xMin, xMax, -5, 5), map(t(i), yMin, yMax, 5, -5))
    const J = Vector.FROM(map(j, xMin, xMax, -5, 5), map(t(j), yMin, yMax, 5, -5))

    const dv = I.copy().substract(J.copy())
    const θ = dv.angle()

    const A = Vector.POLAR(θ, length / 2).add(M)
    const B = Vector.POLAR(θ - PI, length / 2).add(M)

    const line = new Line({ from: A, to: B, doc: this.doc })

    return line
  }

  public getPointAt(a: number, radius: number = 0.05) {
    const xMin = this.minMax.x.min
    const xMax = this.minMax.x.max
    const yMin = this.minMax.y.min
    const yMax = this.minMax.y.max

    const w = Vector.FROM(map(a, xMin, xMax, -5, 5), map(this.f(a), yMin, yMax, 5, -5))

    return new Circle({ radius: 0.05, doc: this.doc }).translate(w)
  }
}

export default Graph
