import { Displayable } from '../displayables'

export namespace IAnimation {
  export type IAnimationFromToParams = {
    duration?: number
    from: Displayable
    to: Displayable
  }
  export type IAnimationParams = {
    duration?: number
    displayable: Displayable
  }
}
