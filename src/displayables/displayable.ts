import { IDisplayable } from '../../@types'
import Color from '../util/color'
import { flat } from '../util/array'
import Matrix from '../util/matrix'
import Vector from '../util/vector'

export const defaultBorderStyle: IDisplayable.IBorder = {
  color: Color.GRAY(),
  weight: 0,
}

export class Displayable {
  public border: IDisplayable.IBorder
  public fill: Color
  public subdisplayables: Displayable[]
  public mat: Matrix
  public path: string
  public parent: Displayable | null
  public domElement: SVGPathElement | SVGGElement | null
  public appendedToDom: boolean
  public opacity: number // from 0 to 1

  constructor({
    border = defaultBorderStyle,
    fill = Color.BLACK(),
    subdisplayables = [],
    mat = new Matrix(),
    path = '',
    parent = null,
    opacity = 1,
  }: IDisplayable.IParams) {
    this.border = border
    this.fill = fill
    this.subdisplayables = subdisplayables
    this.mat = mat
    this.path = path
    this.parent = parent
    this.domElement = null
    this.appendedToDom = false
    this.opacity = opacity
  }

  public setParent(d: Displayable) {
    this.parent = d
    return this
  }

  public getDomElement() {
    if (this.domElement === null) {
      const elementType = this.subdisplayables.length > 0 ? 'g' : 'path'
      this.domElement = document.createElementNS('http://www.w3.org/2000/svg', elementType)
    }

    return this.domElement
  }

  public add(...subdisplayables: Displayable[]) {
    subdisplayables.map((c) => c.setParent(this))
    this.subdisplayables.push(...subdisplayables)
    return this
  }

  public remove(...subdisplayables: Displayable[]) {
    this.subdisplayables = this.subdisplayables.filter((s) => !subdisplayables.includes(s))
    return this
  }

  protected updatePartially<T extends {}, K extends keyof Displayable>(data: Partial<T>, key: K) {
    this[key] = {
      ...(this as any)[key],
      ...data,
    }
  }

  public setFill(color: Color) {
    this.fill = color
    return this
  }

  public setBorder(border: Partial<IDisplayable.IBorder>) {
    this.updatePartially(border, 'border')
    return this
  }

  public getFamily() {
    const arr: Displayable[] = flat<Displayable>(this.subdisplayables.map((child) => child.getFamily()))
    arr.push(this)
    return arr
  }

  public rotate(angle: number) {
    this.mat.rotate(angle)
    return this
  }
  public translate(v: Vector) {
    this.mat.translate(v)
    return this
  }
  public scale(v: Vector) {
    this.mat.scale(v)
    return this
  }

  public copy() {
    return new Displayable({ ...this })
  }
}

export default Displayable
