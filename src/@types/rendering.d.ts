import Color from '../util/color'
import Scene from '../rendering/scene'

export namespace IRendering {
  export type ICameraParams = {
    document: Document
  }

  export type ISceneParams = {
    backgroundColor?: Color
  }

  export type ISceneConstructor = new (params: ISceneParams) => Scene
}
