import { IDisplayable } from '../../@types'
import Color from '../util/color'
import { flat } from '../util/array'
import Matrix from '../util/matrix'
import Vector from '../util/vector'

export const defaultBorderStyle: IDisplayable.IBorder = {
  color: Color.WHITE,
  weight: 5,
}

export class Displayable {
  public border: IDisplayable.IBorder
  public fill: Color
  public subdisplayables: Displayable[]
  public mat: Matrix
  public path: string

  constructor({ border = defaultBorderStyle, fill = Color.WHITE, subdisplayables = [], mat = new Matrix(), path = '' }: IDisplayable.IParams) {
    this.border = border
    this.fill = fill
    this.subdisplayables = subdisplayables
    this.mat = mat
    this.path = path
  }

  public add(...subdisplayables: Displayable[]) {
    this.subdisplayables.push(...subdisplayables)
  }

  public remove(...subdisplayables: Displayable[]) {
    this.subdisplayables = this.subdisplayables.filter((s) => !subdisplayables.includes(s))
  }

  protected updatePartially<T extends {}, K extends keyof Displayable>(data: Partial<T>, key: K) {
    this[key] = {
      ...(this as any)[key],
      ...data,
    }
  }

  public setFill(color: Color) {
    this.fill = color
  }
  public setBorder(border: Partial<IDisplayable.IBorder>) {
    this.updatePartially(border, 'border')
  }

  public getFamily() {
    const arr: Displayable[] = flat<Displayable>(this.subdisplayables.map((child) => child.getFamily()))
    arr.push(this)
    return arr
  }

  //* Need to be overwritten in child classes
  public static async create(params: any) {
    return new Displayable(params)
  }

  public rotate(angle: number) {
    this.mat.rotate(angle)
  }
  public translate(v: Vector) {
    this.mat.translate(v)
  }
  public scale(v: Vector) {
    this.mat.scale(v)
  }
}

export default Displayable
