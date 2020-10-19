import { IAnimation, IInterpolation } from '../types'
import { Displayable } from '../displayables'
import { interpolateDisplayable } from '../interpolation/displayableInterpolation'
import Scene from '../rendering/scene'
import Camera from '../rendering/camera'

export class Animation {
  public duration: number
  public from: Displayable
  public to: Displayable
  public scene: Scene | null
  public camera: Camera | null

  private animators: IInterpolation.IAnimatorPath[]

  constructor({ duration = 1, from, to }: IAnimation.IAnimationFromToParams) {
    this.duration = duration
    this.from = from
    this.to = to
    this.animators = []
    this.scene = null
    this.camera = null
  }

  public bindElements(s: Scene, c: Camera) {
    this.scene = s
    this.camera = c
  }

  public onEnd() {
    const temp = this.to.domElement
    this.to.domElement = this.from.domElement
    this.from.domElement = temp
  }

  public onStart() {
    this.animators = interpolateDisplayable(this.from, this.to, {})
  }

  public update(t: number) {
    if (t >= 1) t = 1

    const camera = this.camera
    if (camera !== null)
      for (const { animator, displayableA } of this.animators) {
        camera.render(animator(t), displayableA)
      }
  }
}

// Renaming base class
export class Transform extends Animation {}

export class FadeIn extends Animation {
  constructor({ duration, displayable }: IAnimation.IAnimationParams) {
    const from = displayable.copy()
    from.opacity = 0
    super({
      duration,
      from,
      to: displayable,
    })
  }
}

export class FadeOut extends Animation {
  constructor({ duration, displayable }: IAnimation.IAnimationParams) {
    const to = displayable.copy()
    to.opacity = 0
    super({
      duration,
      from: displayable,
      to,
    })
  }
}

export default Animation
