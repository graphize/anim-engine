import { ARC_POINTS_COUNT, Rectangle, Line, Triangle } from './geometry'
import { IDisplayable } from '../types'
import { Vector, map, Matrix } from '../util'
import { PI } from '../main'
import Displayable from './displayable'

// TODO Render hyperbolas (currently impossible)
export function generatePointsFromFunction(f: (x: number) => number, minMax: IDisplayable.IGraph.IXYRange, pointsCount: number) {
  minMax = extendXYRange(minMax)
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

function extendRange({ max, min }: IDisplayable.IGraph.IMinMax, n: number = 1): IDisplayable.IGraph.IMinMax {
  return {
    max: max + n,
    min: min - n,
  }
}

function extendXYRange({ x, y }: IDisplayable.IGraph.IXYRange, n: number = 1): IDisplayable.IGraph.IXYRange {
  return {
    x: extendRange(x, n),
    y: extendRange(y, n),
  }
}

function generatePathFromPoints(points: Vector[]) {
  return points.map(({ values }, i) => `${i === 0 ? 'M' : 'L'} ${values[0]} ${values[1]}`).join(' ') + ' Z'
}

export class Graph extends Displayable {
  public f: (x: number) => number
  public minMax: IDisplayable.IGraph.IXYRange

  constructor({ f, minMax, border, fill, mat, opacity, pointsCount = ARC_POINTS_COUNT }: IDisplayable.IGraph.IParams) {
    const points = generatePointsFromFunction(f, minMax, pointsCount)
    const path = generatePathFromPoints(points)
    super({ border, fill, mat, opacity, path })
    this.f = f
    this.minMax = minMax
  }

  // TODO Add fill color gradient
  public getRiemannRectangles({ count, minMax = this.minMax.x, positiveOnly = false }: IDisplayable.IGraph.IRiemannRectanglesParams) {
    const inc = (minMax.max - minMax.min) / count
    const rectangles: Rectangle[] = []
    const xMin = this.minMax.x.min
    const xMax = this.minMax.x.max
    const yMin = this.minMax.y.min
    const yMax = this.minMax.y.max
    const width = map(inc, xMin, xMax, -5, 5)
    for (let x = minMax.min; x < minMax.max; x += inc) {
      const y = this.f(x)
      if (!isNaN(y) && !(positiveOnly && y < 0)) {
        const height = map(y, yMin, yMax, -5, 5)
        const mat = this.mat.clone()
        const r = new Rectangle({ width, height, mat })
        r.translate(Vector.FROM(map(x, xMin, xMax, -5, 5) + width / 2, map(y, yMin, yMax, 5, -5) + height / 2))
        rectangles.push(r)
      }
    }
    return rectangles
  }

  private getArrow(pos: Vector, r: number = 0, mat: Matrix) {
    const triangle = new Triangle({ width: 0.5, mat: mat.clone() })
    triangle.scale(Vector.FROM(0.5, 1))
    triangle.translate(pos)
    triangle.rotate(r)
    return triangle
  }

  // TODO Add ticks and labels
  public getAxis({ arrows = true }: IDisplayable.IGraph.IAxisParams) {
    const xAxis = new Line({ from: Vector.FROM(-5, 0), to: Vector.FROM(5, 0), mat: this.mat.clone() })
    const yAxis = new Line({ from: Vector.FROM(0, -5), to: Vector.FROM(0, 5), mat: this.mat.clone() })
    const displayables = [xAxis, yAxis]
    if (arrows) {
      // xAxis.add(this.getArrow(Vector.FROM(5, 0), -PI / 6,this.mat))
      // yAxis.add(this.getArrow(Vector.FROM(0, -5),0,this.mat))
      displayables.push(this.getArrow(Vector.FROM(5, 0), -PI / 6, this.mat))
      displayables.push(this.getArrow(Vector.FROM(0, -5), 0, this.mat))
    }

    return displayables
  }

  // TODO Add derivative / tangent
}

export default Graph
