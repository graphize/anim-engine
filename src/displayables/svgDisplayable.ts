import Displayable from './displayable'
import { IDisplayable } from '../types'
import { parse, RootNode, Node, ElementNode } from 'svg-parser'
import { Rectangle, Circle, Ellipse, Polygon } from './geometry'
import { Color, Vector, Matrix, flat, map } from '../util'

export class SVGDisplayable extends Displayable {
  private svgContent: string
  private rootNode: RootNode
  private refs: Record<string, IDisplayable.ISVG.IExtendedElementNode> = {}

  constructor({ svg, doc }: IDisplayable.ISVG.IDisplayableParams) {
    super({ doc })
    this.svgContent = svg
    this.rootNode = parse(svg)
    this.extractDisplayables(this.rootNode)
    this.normalizeHeight()
    this.center()
  }

  private extractDisplayables(node: Node | RootNode) {
    this.add(...this.extractDisplayablesFromNode(node))
  }

  private extractDisplayablesFromNode(node: Node | RootNode) {
    const displayables: Displayable[] = []
    if (node.type === 'text') return []

    if (typeof node === 'string' || node.type === 'root' || !node.tagName) {
      const childs = (node.children as (string | Node)[])
        .map((c) => typeof c !== 'string' && this.extractDisplayablesFromNode(c))
        .filter((f) => f !== false)
      displayables.push(...flat<Displayable>(childs))
    } else if (['g', 'svg', 'symbol'].includes(node.tagName)) {
      const childs = (node.children as (string | Node)[])
        .map((c) => typeof c !== 'string' && this.extractDisplayablesFromNode(c))
        .filter((f) => f !== false)
      displayables.push(...flat<Displayable>(childs))
    } else if (node.tagName === 'path') {
      const path = node.properties?.d?.toString()
      const props = node.properties
      if (props && path && path.length > 0)
        displayables.push(
          new Displayable({
            path,
            ...this.getCustomProps(props, node),
          })
        )
    } else if (node.tagName === 'rect') {
      const props = node.properties
      if (props)
        displayables.push(
          new Rectangle({
            width: +props.width,
            height: +props.height,
            ...this.getCustomProps(props, node),
          }).translate(Vector.FROM(+(props.x || 0) + +props.width / 2, +(props.y || 0) + +props.height / 2))
        )
    } else if (node.tagName === 'circle') {
      const props = node.properties
      if (props)
        displayables.push(
          new Circle({
            radius: +(props.r || 0),
            ...this.getCustomProps(props, node),
          }).translate(Vector.FROM(+(props.cx || 0), +(props.cy || 0)))
        )
    } else if (node.tagName === 'ellipse') {
      const props = node.properties
      if (props)
        displayables.push(
          new Ellipse({
            radius: Vector.FROM(+(props.rx || 0), +(props.ry || 0)),
            ...this.getCustomProps(props, node),
          }).translate(Vector.FROM(+(props.cx || 0), +(props.cy || 0)))
        )
    } else if (node.tagName === 'polygon' || node.tagName === 'polyline') {
      const props = node.properties
      if (props) {
        const points = props.points
          .toString()
          .split(' ')
          .map((s) => s.split(','))
          .map(([x, y]) => Vector.FROM(+x, +y))
        displayables.push(
          new Polygon({
            points,
            ...this.getCustomProps(props, node),
          })
        )
      }
    } else if (node.tagName === 'use') {
      if (node.properties && node.properties['xlink:href'] && this.refs[node.properties['xlink:href']]) {
        const id = node.properties['xlink:href']
        const element = this.refs[id]
        const mat = new Matrix()
        const { x, y } = node.properties
        mat.translate(Vector.FROM(+x, +y))
        element.mat = mat
        displayables.push(...this.extractDisplayablesFromNode(element))
      }
    } else if (node.tagName === 'defs') {
      const nodes = this.getAllChildNodesWithID(node)
      for (const n of nodes) {
        if (!n.properties?.id) continue

        this.refs[`#${n.properties.id}`] = n
      }
    }
    return displayables
  }

  private getAllChildNodesWithID(n: ElementNode) {
    if (n.properties?.id) return [n]
    const children: ElementNode[] = []
    for (const child of n.children) {
      if (typeof child === 'string' || child.type === 'text' || !child.properties?.id) continue
      children.push(...this.getAllChildNodesWithID(child))
    }
    return children
  }

  private getCustomProps(
    props: Record<string, string | number>,
    element: IDisplayable.ISVG.IExtendedElementNode
  ): { fill?: Color; border?: IDisplayable.IBorder; mat: Matrix; id?: string } {
    return {
      fill: (props.fill !== undefined && Color.fromHex(props.fill.toString())) || undefined,
      border: {
        color: (props.fill !== undefined && Color.fromHex(props.fill.toString())) || Color.TRANSPARENT(),
        weight: props.fill !== undefined && Color.fromHex(props.fill.toString()) ? 0 : isNaN(+props['stroke-width']) ? 0 : +props['stroke-width'],
      },
      mat: element.mat || new Matrix(),
      id: props.id ? `#${props.id}` : undefined,
    }
  }
}

export async function create({ url, doc }: IDisplayable.ISVG.IParams) {
  const svg = await fetch(url).then((r) => r.text())
  return new SVGDisplayable({ svg, doc: doc })
}

export default SVGDisplayable
