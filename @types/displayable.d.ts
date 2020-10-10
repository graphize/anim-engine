import Color from '../src/util/color'
import Displayable from '../src/displayables/displayable'
import Matrix from '../src/util/matrix'

export namespace IDisplayable {
  export interface IParams {
    fill?: Color
    border?: IBorder
    subdisplayables?: Displayable[]
    mat?: Matrix
    path?: string
  }

  export interface IBorder {
    color: Color
    weight: number
  }

  export interface ITexParams {
    fill?: Color
    border?: IBorder
    value: string
  }

  export interface ISVGParams {
    url: string
  }
}
