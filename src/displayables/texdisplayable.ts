import SVGDisplayable from './svgDisplayable'
import { IDisplayable } from '../types'

export const SERVER_URL = 'http://localhost:3000'

export class TexDisplayable extends SVGDisplayable {}

export const defaultGetSVG = (t: 'tex' | 'text') => (value: string) => fetch(`${SERVER_URL}/${t}/${btoa(value)}`).then((r) => r.text())

export async function create({ value, border, fill, getSVG = defaultGetSVG('tex') }: IDisplayable.ITexParams) {
  const svg = await getSVG(value)
  return new TexDisplayable({ path: svg, border, fill })
}

export default TexDisplayable
