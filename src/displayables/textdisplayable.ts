import { IDisplayable } from '../types'
import TexDisplayable, { SERVER_URL, defaultGetSVG } from './texDisplayable'
import { Vector } from '../util'

export class TextDisplayable extends TexDisplayable {}

export async function create({ value, border, fill, doc, getSVG = defaultGetSVG('text') }: IDisplayable.ITexParams) {
  const svg = await getSVG(value)

  //TODO Add border / fill
  return new TextDisplayable({ svg, doc /*border, fill*/ })
}

export default TextDisplayable
