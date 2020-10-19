import SVGDisplayable from './svgDisplayable'
import { IDisplayable } from '../types'

export const SERVER_URL = 'http://localhost:3000'

export class TexDisplayable extends SVGDisplayable {}

export async function create({ value, border, fill, serverUrl = SERVER_URL }: IDisplayable.ITexParams) {
  const url = `${serverUrl}/tex/${btoa(value)}`
  const svg = await fetch(url).then((r) => r.text())
  return new TexDisplayable({ path: svg, border, fill })
}

export default TexDisplayable
