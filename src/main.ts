import Camera from './rendering/camera'
import { IRendering } from './types'
import * as math from 'mathjs'

export function defineAttributes(svg: SVGSVGElement, windowWidth: number, windowHeight: number) {
  const w = 10
  const h = (w * windowHeight) / windowWidth
  svg.classList.add('anim')
  svg.setAttribute('width', windowWidth.toString())
  svg.setAttribute('height', windowHeight.toString())
  svg.setAttribute('viewBox', `${-w} ${-h} ${w * 2} ${h * 2}`)
}

export async function renderScene(cam: Camera, Scene: IRendering.ISceneConstructor) {
  const scene = new Scene({ timeInterval: (f) => requestAnimationFrame(f) })
  await cam.renderScene(scene)
}

export * from './types'
export * from './animations/animation'
export * from './animations/easing'
export * from './displayables'
export * from './rendering/camera'
export * from './rendering/scene'
export * from './util'
export { math }
export const PI = Math.PI
export const TAU = PI * 2
export const E = Math.E
