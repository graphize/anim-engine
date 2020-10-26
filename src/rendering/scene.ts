import { IRendering } from '../types'
import { Displayable } from '../displayables'
import Color from '../util/color'
import { wait, map } from '../util/methods'
import Animation, { AnimationGroup } from '../animations/animation'
import Camera from './camera'

export const defaultTimeUpdater: IRendering.ITimeUpdater = (dt, a) => map(dt, 0, a.duration * 1000, 0, 1)

export class Scene {
  public displayables: Displayable[]
  public backgroundColor: Color
  public cam: Camera | null

  public updateTime: IRendering.ITimeUpdater
  public timeInterval: IRendering.ITimeInterval

  constructor({ backgroundColor = Color.BLACK(), updateTime = defaultTimeUpdater, timeInterval = requestAnimationFrame }: IRendering.ISceneParams) {
    this.displayables = []
    this.backgroundColor = backgroundColor
    this.cam = null
    this.updateTime = updateTime
    this.timeInterval = timeInterval
  }

  public async define() {
    await this.wait(1)
  }

  public bindCamera(c: Camera) {
    this.cam = c
  }

  public add(...displayables: Displayable[]) {
    this.displayables.push(...displayables)
  }

  public remove(...displayables: Displayable[]) {
    this.displayables = this.displayables.filter((s) => !displayables.includes(s))
  }

  public async wait(t: number = 1) {
    await wait(t)
  }

  private _playGroup(a: AnimationGroup) {
    return this.play(...a.animations)
  }

  private _play(a: Animation) {
    if (a instanceof AnimationGroup) return this._playGroup(a)

    return new Promise((res, rej) => {
      let dt = 0
      let prevTime = Date.now()
      let t = -a.delay

      if (this.cam !== null) a.bindElements(this, this.cam)

      a.onStart()

      const update = () => {
        const d = Date.now()
        dt = d - prevTime
        prevTime = d

        if (t > 1) {
          t = 1
          const x = a.easing(t)
          a.update(x)
          a.onEnd()
          res()
        } else {
          const x = a.easing(t)
          a.update(x)

          t += this.updateTime(dt, a)

          this.timeInterval(update)
        }
      }
      this.timeInterval(update)
    })
  }

  public async play(...animations: Animation[]) {
    await Promise.all(animations.map((animation) => this._play(animation)))
  }
}

export default Scene
