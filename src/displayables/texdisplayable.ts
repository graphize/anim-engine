import SVGDisplayable from './svgDisplayable'
import { IDisplayable } from '../../@types'
import { SERVER_URL } from '../constants'

export class TexDisplayable extends SVGDisplayable {}

export async function create({ value, border, fill }: IDisplayable.ITexParams) {
  const url = `${SERVER_URL}/tex/${btoa(value)}`
  const svg = await fetch(url).then(r => r.text())
  return new TexDisplayable({ path: svg, border, fill })
}

export default TexDisplayable
