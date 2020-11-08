import { Displayable } from '../displayables'
import { Animation } from '../animations/animation'

export namespace IAnimation {
  export type IParams = {
    duration?: number
    delay?: number
    easing?: IEasingFunction
  }

  export type IEasingFunction = (t: number) => number

  export type IAnimationFromToParams<IFromDisplayableType extends Displayable, IToDisplayableType extends Displayable> = IParams & {
    from: IFromDisplayableType
    to: IToDisplayableType
  }

  export type IAnimationParams<IDisplayableType extends Displayable> = IParams & {
    displayable: IDisplayableType
  }

  export type IAnimationGroupParams = {
    animations: Animation[]
    delay?: number
    lag?: number
    easing?: IEasingFunction
  }
}
