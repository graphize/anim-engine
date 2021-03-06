import { Displayable } from '../displayables'

export namespace IInterpolation {
  export type IAnimator = (t: number) => Displayable

  export type IValueAnimator = (t: number) => number

  export type IAnimatorPath = {
    displayableA: Displayable
    displayableB: Displayable
    animator: IAnimator
  }

  export type IPathOptions = {
    stepSize?: number | false
  }
}
