import { IDisplayable } from '../../@types'
import { SERVER_URL } from '../constants'
import TexDisplayable from './texDisplayable'

export class TextDisplayable extends TexDisplayable {}

export async function create({ value, border, fill }: IDisplayable.ITexParams) {
  const url = `${SERVER_URL}/text/${btoa(value)}`
  const svg = await fetch(url).then(r => r.text())
  return new TextDisplayable({ path: svg, border, fill })
}

export default TextDisplayable
