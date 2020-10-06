import { IRendering } from '../../@types'
import Color from '../util/color'

export class Camera {
  public background: Color

  constructor({ background = Color.BLACK }: IRendering.ICameraParams) {
    this.background = background
  }
}

export default Camera
