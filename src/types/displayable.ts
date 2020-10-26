import Color from '../util/color'
import Displayable from '../displayables/displayable'
import Vector from '../util/vector'
import Matrix from '../util/matrix'
import { ElementNode } from 'svg-parser'

export namespace IDisplayable {
  export type IParams = {
    fill?: Color
    border?: IBorder
    subdisplayables?: Displayable[]
    mat?: Matrix
    path?: string
    parent?: Displayable | null
    opacity?: number
    id?: string
    doc?: Document
  }

  export type IBorder = {
    color: Color
    weight: number
    offset?: number
    array?: number
  }

  export type ITexParams = {
    fill?: Color
    border?: IBorder
    value: string
    getSVG?: (v: string) => Promise<string>
    doc?: Document
  }
  export type IGroupParams = {
    displayables: Displayable[]
    mat?: Matrix
    doc?: Document
  }

  export namespace ISVG {
    export type IParams = {
      url: string
      doc?: Document
    }

    export type IDisplayableParams = {
      svg: string
      doc?: Document
    }

    export type IExtendedElementNode = ElementNode & {
      mat?: Matrix
    }
  }

  export type IMinMax = {
    min: number
    max: number
  }

  export type IXYRange = {
    x: IMinMax
    y: IMinMax
  }

  export namespace IGraph {
    export type IAxisParams = {
      arrows?: boolean
      minMax: IXYRange
    }

    export type IParams = {
      fill?: Color
      border?: IBorder
      f: (x: number) => number
      minMax: IXYRange
      mat?: Matrix
      opacity?: number
      pointsCount?: number
      doc?: Document
    }

    export type IRiemannRectanglesParams = {
      count: number
      minMax?: IMinMax
      fillGradient?: [Color, Color]
      borderGradient?: [IBorder, IBorder]
      positiveOnly?: boolean
    }
  }

  export namespace IShapes {
    export type IParams = {
      fill?: Color
      border?: IBorder
      mat?: Matrix
      opacity?: number
      doc?: Document
    }

    export type IPolygonParams = IParams & {
      points: Vector[]
    }

    export type ITriangleParams = IParams & {
      width: number
    }

    export type ISquareParams = IParams & {
      width: number
    }

    export type IRectangleParams = IParams & {
      width: number
      height: number
    }

    export type IArcParams = IParams & {
      radius: Vector
      startAngle: number
      endAngle: number
      degrees?: boolean
      pointsCount?: number
    }

    export type IEllipseParams = IParams & {
      radius: Vector
      pointsCount?: number
      offset?: number
    }

    export type ICircleParams = IParams & {
      radius: number
      pointsCount?: number
      offset?: number
    }

    export type ILineParams = IParams & {
      from: Vector
      to: Vector
    }
  }
}
