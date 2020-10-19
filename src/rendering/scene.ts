import { IRendering } from '../types'
import { Displayable } from '../displayables'
import Color from '../util/color'
import { wait, map } from '../util/methods'
import Animation from '../animations/animation'
import Camera from './camera'

export const defaultTimeUpdater: IRendering.ITimeUpdater = (dt, a) => map(dt, 0, a.duration * 1000, 0, 1)

export class Scene {
  public displayables: Displayable[]
  public backgroundColor: Color
  public cam: Camera | null

  public updateTime: IRendering.ITimeUpdater

  constructor({ backgroundColor = Color.BLACK(), updateTime = defaultTimeUpdater }: IRendering.ISceneParams) {
    this.displayables = []
    this.backgroundColor = backgroundColor
    this.cam = null
    this.updateTime = updateTime
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

  public play(a: Animation) {
    return new Promise((res, rej) => {
      let dt = 0
      let prevTime = Date.now()
      let t = 0

      if (this.cam !== null) a.bindElements(this, this.cam)

      a.onStart()

      const update = () => {
        const d = Date.now()
        dt = d - prevTime
        prevTime = d

        a.update(t)

        t += this.updateTime(dt, a)
        // console.log(t)

        if (t <= 1.0001) requestAnimationFrame(update)
        else {
          a.onEnd()
          res()
        }
      }
      requestAnimationFrame(update)
    })
  }
}

export default Scene
