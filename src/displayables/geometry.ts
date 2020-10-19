import Displayable from './displayable'
import { IDisplayable } from '../@types'
import { Vector } from '../util/vector'
import { range, map, radians } from '../util/methods'
import { TAU, PI } from '../main'
import Matrix from '../util/matrix'

export class Polygon extends Displayable {
  public points: Vector[]
  constructor({ border, fill, points, mat, opacity }: IDisplayable.IShapes.IPolygonParams) {
    const path = points.map(({ values }, i) => `${i === 0 ? 'M' : 'L'} ${values[0]} ${values[1]}`).join(' ') + ' Z'

    super({ mat, border, fill, path, opacity })

    this.points = points
  }

  public updatePath() {
    const path = this.points.map(({ values }) => `L ${values[0]} ${values[1]}`).join(' ')
    this.path = path
    return path
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
  }: IDisplayable.IShapes.IArcParams) {
    if (degrees) {
      startAngle = radians(startAngle)
      endAngle = radians(endAngle)
    }

    const [rX, rY] = radius.values

    const angles = range(pointsCount).map((i) => map(i, 0, pointsCount, startAngle, endAngle))
    const points = angles.map((θ) => Vector.POLAR(θ, rX))

    mat.scale(Vector.FROM(1, rY / rX))

    super({ fill, border, mat, opacity, points })
  }
}

export class Ellipse extends Arc {
  constructor({ radius, border, fill, mat, opacity, pointsCount, offset = 0 }: IDisplayable.IShapes.IEllipseParams) {
    super({ radius, border, fill, mat, opacity, pointsCount, startAngle: offset, endAngle: TAU + offset, degrees: false })
  }
}

export class Circle extends Ellipse {
  constructor({ radius: r, border, fill, mat, opacity, pointsCount, offset }: IDisplayable.IShapes.ICircleParams) {
    const radius = Vector.FROM(r, r)
    super({ radius, border, fill, mat, opacity, pointsCount, offset })
  }
}

export class RegularPolygon extends Circle {}

export class Triangle extends RegularPolygon {
  constructor({ border, width, fill, mat, opacity }: IDisplayable.IShapes.ITriangleParams) {
    super({ border, radius: width / 2, fill, mat, pointsCount: 3, offset: PI / 6, opacity })
  }
}

export class Diamond extends RegularPolygon {
  constructor({ border, width, fill, mat, opacity }: IDisplayable.IShapes.ISquareParams) {
    super({ border, radius: width / 2, fill, mat, pointsCount: 4, opacity })
  }
}
export class Rectangle extends Polygon {
  constructor({ border, width, height, fill, mat, opacity }: IDisplayable.IShapes.IRectangleParams) {
    const points = [Vector.FROM(0, 0), Vector.FROM(width, 0), Vector.FROM(width, height), Vector.FROM(0, height)]
    super({ border, points, fill, mat, opacity })
  }
}

export class Square extends Rectangle {
  constructor({ border, width, fill, mat, opacity }: IDisplayable.IShapes.ISquareParams) {
    super({ border, width, height: width, fill, mat, opacity })
  }
}
