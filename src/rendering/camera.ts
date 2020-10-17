import { IRendering } from '../../@types'
import Color from '../util/color'
import { Displayable } from '../displayables'
import { range } from '../util/methods'
import Scene from './scene'

export class Camera {
  public domElement: SVGSVGElement

  constructor({}: IRendering.ICameraParams) {
    this.domElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  }

  public render(d: Displayable, original: Displayable) {
    const domElement = original.getDomElement()
    if (!original.appendedToDom) {
      this.domElement.appendChild(domElement)
      original.appendedToDom = true
    }

    this.setStyles(domElement, d)

    if (d.path.length > 0) domElement.setAttribute('d', d.path)

    if (d.subdisplayables.length > 0)
      for (const i of range(d.subdisplayables.length)) {
        const child = d.subdisplayables[i]
        const originalChild = original.subdisplayables[i]
        this.render(child, originalChild)
      }
  }

  public async renderScene(s: Scene) {
    s.bindCamera(this)
    await s.define()
  }

  public setStyles(elem: SVGElement, d: Displayable) {
    elem.style.transform = d.mat.toString()
    elem.style.fill = d.fill.toCss()
    elem.style.fillOpacity = d.fill.toCssOpacity()
    elem.style.stroke = d.border.color.toCss()
    elem.style.opacity = d.opacity.toString()
    elem.style.strokeWidth = `${d.border.weight}px`
  }
}

export default Camera
