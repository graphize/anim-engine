import Displayable from './displayable'
import { IDisplayable } from '../../@types'
import { Vector } from '../util/vector'
import { range, map } from '../util/methods'
import { TAU, PI } from '../constants'

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
export class RegularPolygon extends Polygon {
  constructor({ border, pointsCount, radius, fill, mat, offset = 0, opacity }: IDisplayable.IShapes.IRegularPolygonParams) {
    const r = radius / 2

    const angles = range(pointsCount).map((i) => map(i, 0, pointsCount, 0, TAU) + offset)
    const points = angles.map((a) => Vector.FROM(r * Math.cos(a) + r, r * Math.sin(a) + r))

    super({ border, fill, mat, points, opacity })
  }
}

export class Triangle extends RegularPolygon {
  constructor({ border, width, fill, mat, opacity }: IDisplayable.IShapes.ITriangleParams) {
    super({ border, radius: width, fill, mat, pointsCount: 3, offset: PI / 6, opacity })
  }
}

export class Diamond extends RegularPolygon {
  constructor({ border, width, fill, mat, opacity }: IDisplayable.IShapes.ISquareParams) {
    super({ border, radius: width, fill, mat, pointsCount: 4, opacity })
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

// ! WIP
export class Arc extends Displayable {
  constructor({ border, center, endAngle, radiusX, radiusY, startAngle, fill, mat, opacity }: IDisplayable.IShapes.IArcParams) {
    const [cx, cy] = center.values
    const path = `M ${cx} ${cy + radiusY} A ${radiusX},${radiusY} 0 1,0  `
    super({ border, fill, mat, opacity, path })
  }
}
// ! END WIP
