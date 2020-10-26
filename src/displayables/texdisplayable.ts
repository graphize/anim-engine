import SVGDisplayable from './svgDisplayable'
import { IDisplayable } from '../types'
import { Vector } from '../util'

export const SERVER_URL = 'http://localhost:3000'

export class TexDisplayable extends SVGDisplayable {}

export const defaultGetSVG = (t: 'tex' | 'text') => (value: string) => fetch(`${SERVER_URL}/${t}/${btoa(value)}`).then((r) => r.text())

export async function create({ value, border, fill, getSVG = defaultGetSVG('tex'), doc }: IDisplayable.ITexParams) {
  const svg = await getSVG(value)

  // TODO Add Borders / Fill
  return new TexDisplayable({ svg, doc /*border, fill*/ })
}

export default TexDisplayable
