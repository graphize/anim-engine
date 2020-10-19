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
  }

  export type ITimeUpdater = (dt: number, a: Animation) => number

  export type ISceneConstructor = new (params: ISceneParams) => Scene
}
