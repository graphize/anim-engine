import { IDisplayable } from '../types'
import Color from '../util/color'
import { flat } from '../util/array'
import Matrix from '../util/matrix'
import Vector from '../util/vector'
import { range, map } from '../util'
import clonedeep from 'lodash.clonedeep'

export const defaultBorderStyle: IDisplayable.IBorder = {
  color: Color.GRAY(),
  weight: 0,
}

export const randomID = () => Math.random().toString(36).substr(2, 9)

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
  public id: string
  public doc: Document

  constructor({
    border = defaultBorderStyle,
    fill = Color.BLACK(),
    subdisplayables = [],
    mat = new Matrix(),
    path = '',
    parent = null,
    opacity = 1,
    id = randomID(),
    doc = document,
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
    this.id = id
    this.doc = doc
  }

  public setParent(d: Displayable) {
    this.parent = d
    return this
  }

  public getDomElement() {
    if (this.domElement === null) {
      const elementType = this.subdisplayables.length > 0 ? 'g' : 'path'
      this.domElement = this.doc.createElementNS('http://www.w3.org/2000/svg', elementType)
      if (elementType === 'path') this.domElement.setAttribute('d', this.path)
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

  public scale(val: Vector | number) {
    if (typeof val === 'number') val = Vector.FROM(val, val)

    return this._scale(val)
  }

  private _scale(v: Vector) {
    this.mat.scale(v)
    return this
  }

  public copy<T extends Displayable>() {
    const displayable = (clonedeep(this) as any) as T
    displayable.appendedToDom = false
    displayable.domElement = null
    displayable.id = randomID()
    return displayable
  }

  public center() {
    const c = this.getCenter()
    c.mult(-1)
    this.translate(c)
  }

  public normalize() {
    const size = this.getSize()
    size.invert()
    this.scale(size)
  }

  public normalizeHeight() {
    const size = this.getSize()
    const [w, h] = size.values
    this.scale(Vector.FROM(1 / h, 1 / h))
  }

  public normalizeWidth() {
    const size = this.getSize()
    const [w, h] = size.values
    this.scale(Vector.FROM(1 / w, 1 / w))
  }

  public getSize() {
    const { x, y } = this.getMinMax()
    const w = x.max - x.min
    const h = y.max - y.min
    return Vector.FROM(w, h)
  }

  public getCenter() {
    const { x, y } = this.getMinMax()
    const cX = (x.max - x.min) / 2 + x.min
    const cY = (y.max - y.min) / 2 + y.min
    return Vector.FROM(cX, cY)
  }

  public getMinMax(): IDisplayable.IXYRange {
    const points = this.getPoints(200)
    const xValues = points.map(({ values }) => values[0])
    const yValues = points.map(({ values }) => values[1])
    return {
      x: {
        min: Math.min(...xValues),
        max: Math.max(...xValues),
      },
      y: {
        min: Math.min(...yValues),
        max: Math.max(...yValues),
      },
    }
  }

  public getPoints(count: number) {
    const _dom = this.getDomElement()
    if (_dom.tagName !== 'path') {
      const points: Vector[] = []
      this.subdisplayables.forEach((child) => points.push(...child.getPoints(count)))
      return points
    }

    const path = _dom as SVGPathElement
    const len = path.getTotalLength()
    const points: Vector[] = []
    for (const i of range(count)) {
      const dist = map(i, 0, count - 1, 0, len)
      const pt = path.getPointAtLength(dist)
      const v = Vector.FROM(pt.x, pt.y)
      v.applyMatrix(this.mat)
      points.push(v)
    }
    return points
  }
}

export class Group extends Displayable {
  constructor({ displayables, mat, doc }: IDisplayable.IGroupParams) {
    super({ mat, subdisplayables: displayables, doc })
  }
}

export default Displayable
