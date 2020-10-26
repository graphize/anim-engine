import { Displayable } from '../displayables'
import { Animation } from '../animations/animation'

export namespace IAnimation {
  export type IParams = {
    duration?: number
    delay?: number
    easing?: IEasingFunction
  }

  export type IEasingFunction = (t: number) => number

  export type IAnimationFromToParams = IParams & {
    from: Displayable
    to: Displayable
  }

  export type IAnimationParams = IParams & {
    displayable: Displayable
  }

  export type IAnimationGroupParams = {
    animations: Animation[]
    delay?: number
    lag?: number
    easing?: IEasingFunction
  }
}
