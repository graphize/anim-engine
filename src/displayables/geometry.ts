import Displayable from './displayable'
import { IDisplayable } from '../../@types'
import { Vector } from '../util/vector'
import { range, map } from '../util/math'
import { TAU, PI } from '../constants'

export class Polygon extends Displayable {
  public points: Vector[]
  constructor({ border, fill, points, mat }: IDisplayable.IShapes.IPolygonParams) {
    const path = points.map(({ values }, i) => `${i === 0 ? 'M' : 'L'} ${values[0]} ${values[1]}`).join(' ')

    super({ mat, border, fill, path })

    this.points = points
  }

  public updatePath() {
    const path = this.points.map(({ values }) => `L ${values[0]} ${values[1]}`).join(' ')
    this.path = path
    return path
  }
}
export class RegularPolygon extends Polygon {
  constructor({ border, pointsCount, radius, fill, mat, offset = 0 }: IDisplayable.IShapes.IRegularPolygonParams) {
    const r = radius / 2
    const angles = range(pointsCount).map((i) => map(i, 0, pointsCount, 0, TAU) + offset)
    const points = angles.map((a) => Vector.FROM(r * Math.cos(a) + r, r * Math.sin(a) + r))

    super({ border, fill, mat, points })
  }
}

export class Triangle extends RegularPolygon {
  constructor({ border, width, fill, mat }: IDisplayable.IShapes.ITriangleParams) {
    super({ border, radius: width, fill, mat, pointsCount: 3, offset: PI / 6 })
  }
}

export class Square extends RegularPolygon {
  constructor({ border, width, fill, mat }: IDisplayable.IShapes.ISquareParams) {
    super({ border, radius: width, fill, mat, pointsCount: 4, offset: PI / 4 })
  }
}
export class Diamond extends RegularPolygon {
  constructor({ border, width, fill, mat }: IDisplayable.IShapes.ISquareParams) {
    super({ border, radius: width, fill, mat, pointsCount: 4 })
  }
}
export class Rectangle extends Square {
  constructor({ border, width, height, fill, mat }: IDisplayable.IShapes.IRectangleParams) {
    super({ border, width, fill, mat })
    const aspectRatio = width / height
    this.scale(Vector.FROM(aspectRatio, 1))
  }
}
