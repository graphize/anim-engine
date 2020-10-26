import Displayable from './displayable'
import { IDisplayable } from '../types'
import { Vector } from '../util/vector'
import { range, map, radians } from '../util/methods'
import { TAU, PI } from '../main'
import Matrix from '../util/matrix'
import { Color } from '../util'

export class Polygon extends Displayable {
  public points: Vector[]
  constructor({ border, fill, points, mat, opacity, doc }: IDisplayable.IShapes.IPolygonParams) {
    const path = points.map(({ values }, i) => `${i === 0 ? 'M' : 'L'} ${values[0]} ${values[1]}`).join(' ') + ' Z'

    super({ mat, border, fill, path, opacity, doc })

    this.points = points
  }
}

export const ARC_POINTS_COUNT = 200

export class Arc extends Polygon {
  constructor({
    fill,
    mat = new Matrix(),
    opacity,
    radius,
    startAngle,
    endAngle,
    border,
    degrees = false,
    pointsCount = ARC_POINTS_COUNT,
    doc,
  }: IDisplayable.IShapes.IArcParams) {
    if (degrees) {
      startAngle = radians(startAngle)
      endAngle = radians(endAngle)
    }

    const [rX, rY] = radius.values

    const angles = range(pointsCount).map((i) => map(i, 0, pointsCount, startAngle, endAngle))
    const points = angles.map((θ) => Vector.POLAR(θ, rX))

    mat.scale(Vector.FROM(1, rY / rX))

    super({ fill, border, mat, opacity, points, doc })
  }
}

export class Ellipse extends Arc {
  constructor({ radius, border, fill, mat, opacity, pointsCount, offset = 0, doc }: IDisplayable.IShapes.IEllipseParams) {
    super({ radius, border, fill, mat, opacity, pointsCount, startAngle: offset, endAngle: TAU + offset, degrees: false, doc })
  }
}

export class Circle extends Ellipse {
  constructor({ radius: r, border, fill, mat, opacity, pointsCount, offset, doc }: IDisplayable.IShapes.ICircleParams) {
    const radius = Vector.FROM(r, r)
    super({ radius, border, fill, mat, opacity, pointsCount, offset, doc })
  }
}

export class RegularPolygon extends Circle {}

export class Triangle extends RegularPolygon {
  constructor({ border, width, fill, mat, opacity, doc }: IDisplayable.IShapes.ITriangleParams) {
    super({ border, radius: width / 2, fill, mat, pointsCount: 3, offset: PI / 6, opacity, doc })
  }
}

export class Diamond extends RegularPolygon {
  constructor({ border, width, fill, mat, opacity, doc }: IDisplayable.IShapes.ISquareParams) {
    super({ border, radius: width / 2, fill, mat, pointsCount: 4, opacity, doc })
  }
}
export class Rectangle extends Polygon {
  constructor({ border, width, height, fill, mat, opacity, doc }: IDisplayable.IShapes.IRectangleParams) {
    const w = width / 2
    const h = height / 2
    const points = [Vector.FROM(-w, -h), Vector.FROM(w, -h), Vector.FROM(w, h), Vector.FROM(-w, h)]
    super({ border, points, fill, mat, opacity, doc })
  }
}

export class Square extends Rectangle {
  constructor({ border, width, fill, mat, opacity, doc }: IDisplayable.IShapes.ISquareParams) {
    super({ border, width, height: width, fill, mat, opacity, doc })
  }
}

export class Line extends Polygon {
  constructor({
    from,
    to,
    border = { weight: 1, color: Color.BLACK() },
    fill = Color.TRANSPARENT(),
    mat,
    opacity,
    doc,
  }: IDisplayable.IShapes.ILineParams) {
    const points = [from, to]
    super({ border, fill, mat, points, opacity, doc })
  }
}
