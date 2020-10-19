import { IDisplayable } from '../types'
import TexDisplayable, { SERVER_URL, defaultGetSVG } from './texDisplayable'

export class TextDisplayable extends TexDisplayable {}

export async function create({ value, border, fill, getSVG = defaultGetSVG('text') }: IDisplayable.ITexParams) {
  const svg = await getSVG(value)
  return new TextDisplayable({ path: svg, border, fill })
}

export default TextDisplayable
