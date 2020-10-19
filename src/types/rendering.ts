import Color from '../util/color'
import Scene from '../rendering/scene'
import Animation from '../animations/animation'

export namespace IRendering {
  export type ICameraParams = {
    document: Document
  }

  export type ISceneParams = {
    backgroundColor?: Color
    updateTime?: ITimeUpdater
    timeInterval?: ITimeInterval
  }

  export type ITimeUpdater = (dt: number, a: Animation) => number
  export type ITimeInterval = (f: () => void) => void

  export type ISceneConstructor = new (params: ISceneParams) => Scene
}
