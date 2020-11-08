import { IAnimation, IInterpolation, IDisplayable } from '../types'
import { Displayable, Graph } from '../displayables'
import { interpolateDisplayable } from '../interpolation/displayableInterpolation'
import Scene from '../rendering/scene'
import Camera from '../rendering/camera'
import { linear } from './easing'
import { Color } from '../util'

export class Animation {
  public duration: number
  protected scene: Scene | null
  protected camera: Camera | null
  public delay: number
  public easing: IAnimation.IEasingFunction

  constructor({ duration = 1, delay = 0, easing = linear }: IAnimation.IParams) {
    this.duration = duration
    this.delay = delay
    this.scene = null
    this.camera = null
    this.easing = easing
  }

  public bindElements(s: Scene, c: Camera) {
    this.scene = s
    this.camera = c
  }

  public onEnd() {}

  public onStart() {}

  public update(t: number) {
    if (t >= 1) t = 1
    if (t <= 0) t = 0
  }
}

export class Transform extends Animation {
  protected from: Displayable
  protected to: Displayable

  protected lastFrame: Displayable[] = []

  protected animators: IInterpolation.IAnimatorPath[]

  constructor({ duration = 1, from, to, delay, easing }: IAnimation.IAnimationFromToParams<Displayable, Displayable>) {
    super({ duration, delay, easing })
    this.from = from
    this.to = to
    this.animators = []
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
    if (t <= 0) t = 0

    const camera = this.camera
    if (camera !== null) {
      let i = 0
      for (const { animator, displayableA } of this.animators) {
        const current = animator(t)
        if (current !== this.lastFrame[i]) {
          camera.render(current, displayableA)
          this.lastFrame[i] = current.copy()
        }
      }
    }
  }
}
export class AnimationGroup extends Animation {
  public animations: Animation[]
  public lag: number

  constructor({ animations, lag = 0, delay = 0, easing }: IAnimation.IAnimationGroupParams) {
    super({ delay, easing })
    this.animations = animations
    this.animations.forEach((a, i) => (a.delay += lag * i + delay))
    this.lag = lag
  }

  public bindElements(s: Scene, c: Camera) {
    this.scene = s
    this.camera = c
    this.animations.map((a) => a.bindElements(s, c))
  }

  public onStart() {
    this.animations.forEach((a) => a.onStart())
  }

  public onEnd() {
    this.animations.forEach((a) => a.onEnd())
  }

  public update(t: number) {
    this.animations.forEach((a) => a.update(t))
  }
}

export class FadeIn extends Transform {
  constructor({ duration, displayable, delay, easing }: IAnimation.IAnimationParams<Displayable>) {
    const from = displayable.copy()
    from.opacity = 0
    super({
      duration,
      from,
      to: displayable,
      delay,
      easing,
    })
  }
}

export class FadeOut extends Transform {
  constructor({ duration, displayable, delay, easing }: IAnimation.IAnimationParams<Displayable>) {
    const to = displayable.copy()
    to.opacity = 0
    super({
      duration,
      from: displayable,
      to,
      delay,
      easing,
    })
  }
}

const noBorder: IDisplayable.IBorder = { weight: 0, color: Color.TRANSPARENT() }

export class DrawBorder extends Transform {
  private _baseDisplayable: Displayable

  constructor({ duration, displayable, delay, easing }: IAnimation.IAnimationParams<Displayable>) {
    if (displayable.subdisplayables.length > 0 || displayable.path.length === 0) throw 'DrawBorder animation does not work with childs'
    const totalLength = (displayable.getDomElement() as SVGPathElement).getTotalLength()
    displayable.border.array = totalLength
    const from = displayable.copy()
    from.border.offset = totalLength
    const to = displayable.copy()
    to.border.offset = 0
    super({
      duration,
      from,
      to,
      delay,
      easing,
    })
    this._baseDisplayable = displayable
  }

  public onEnd() {
    this._baseDisplayable.domElement = this.from.domElement
    if (this.from.domElement?.style.strokeDasharray) this.from.domElement.style.strokeDasharray = ''
    if (this.from.domElement?.style.strokeDashoffset) this.from.domElement.style.strokeDashoffset = ''
    const temp = this.to.domElement
    this.to.domElement = this.from.domElement
    this.from.domElement = temp
  }
}

export class UndrawBorder extends Transform {
  private _baseDisplayable: Displayable
  private _dom: SVGPathElement

  constructor({ duration, displayable, delay, easing }: IAnimation.IAnimationParams<Displayable>) {
    if (displayable.subdisplayables.length > 0 || displayable.path.length === 0) throw 'DrawBorder animation does not work with childs'

    const dom = displayable.getDomElement() as SVGPathElement
    const totalLength = dom.getTotalLength()
    displayable.border.array = totalLength
    const from = displayable.copy()
    from.border.offset = 0
    const to = displayable.copy()
    to.border.offset = totalLength
    super({
      duration,
      from,
      to,
      delay,
      easing,
    })
    this._baseDisplayable = displayable
    this._dom = dom
  }

  public onStart() {
    super.onStart()
    this._dom.remove()
  }

  public onEnd() {
    this._baseDisplayable.domElement = this.from.domElement
    this._baseDisplayable.setBorder(noBorder)
    const temp = this.to.domElement
    this.to.domElement = this.from.domElement
    this.from.domElement = temp
  }
}

export class Fill extends Transform {
  constructor({ duration, displayable, delay, easing }: IAnimation.IAnimationParams<Displayable>) {
    const from = displayable.copy()
    const col = displayable.fill.copy()
    col.setTransparency(0)
    from.setFill(col)
    super({
      duration,
      from,
      to: displayable,
      easing,
      delay,
    })
  }
}

export class DisplayGraph extends AnimationGroup {
  constructor({ duration, displayable, delay, easing }: IAnimation.IAnimationParams<Graph>) {
    const displayables = displayable.subdisplayables

    const animations = displayables.map((d) => new DrawBorder({ duration, displayable: d }))

    super({
      animations,
      lag: 0.025,
      easing,
      delay,
    })
  }
}

export class UndisplayGraph extends AnimationGroup {
  constructor({ duration, displayable, delay, easing }: IAnimation.IAnimationParams<Graph>) {
    const displayables = displayable.subdisplayables.reverse()

    const animations = displayables.map((d) => new UndrawBorder({ duration, displayable: d }))

    super({
      animations,
      lag: 0.025,
      easing,
      delay,
    })
  }
}

export default Animation
