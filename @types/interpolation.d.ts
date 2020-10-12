import { Displayable } from '../src/displayables'

export namespace IInterpolation {
  export type IAnimator = (t: number) => Displayable

  export type IAnimatorPath = {
    displayableA: Displayable
    displayableB: Displayable
    animator: IAnimator
  }

  export type IPathOptions = {
    smoothing?: number | false
  }
}
