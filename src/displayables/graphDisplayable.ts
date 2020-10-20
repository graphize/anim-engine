import { Polygon, ARC_POINTS_COUNT, Rectangle } from './geometry'
import { IDisplayable } from '../types'
import { Vector, map } from '../util'

export function generatePointsFromFunction(f: (x: number) => number, minMax: IDisplayable.IGraph.IRange, pointsCount: number) {
  const xMin = minMax.x.min
  const xMax = minMax.x.max
  const yMin = minMax.y.min
  const yMax = minMax.y.max
  const xInc = (xMax - xMin) / pointsCount
  const points: Vector[] = []

  for (let x = xMin; x < xMax; x += xInc) {
    const y = f(x)
    if (!isNaN(y)) points.push(Vector.FROM(map(x, xMin, xMax, -5, 5), map(y, yMin, yMax, 5, -5)))
  }
  return points
}

export class Graph extends Polygon {
  public f: (x: number) => number
  public minMax: IDisplayable.IGraph.IRange

  constructor({ f, minMax, border, fill, mat, opacity, pointsCount = ARC_POINTS_COUNT }: IDisplayable.IGraph.IParams) {
    const points = generatePointsFromFunction(f, minMax, pointsCount)
    super({ border, fill, mat, opacity, points, notConnectedToStart: true })
    this.f = f
    this.minMax = minMax
  }

  public getRiemannRectangles({ count, minMax = this.minMax.x }: IDisplayable.IGraph.IRiemannRectanglesParams) {
    const inc = (minMax.max - minMax.min) / count
    const rectangles: Rectangle[] = []
    const xMin = this.minMax.x.min
    const xMax = this.minMax.x.max
    const yMin = this.minMax.y.min
    const yMax = this.minMax.y.max
    const width = map(inc, xMin, xMax, -5, 5)
    for (let x = minMax.min; x < minMax.max; x += inc) {
      const y = this.f(x)
      if (!isNaN(y)) {
        const height = map(y, yMin, yMax, 5, -5)
        const r = new Rectangle({ width, height })
        r.translate(Vector.FROM(map(x, xMin, xMax, -5, 5) + width / 2, map(y, yMin, yMax, 5, -5) + height / 2))
        rectangles.push(r)
      }
    }
    return rectangles
  }
}

export default Graph
