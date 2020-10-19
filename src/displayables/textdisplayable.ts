import { IDisplayable } from '../@types'
import TexDisplayable, { SERVER_URL } from './texDisplayable'

export class TextDisplayable extends TexDisplayable {}

export async function create({ value, border, fill, serverUrl = SERVER_URL }: IDisplayable.ITexParams) {
  const url = `${serverUrl}/text/${btoa(value)}`
  const svg = await fetch(url).then((r) => r.text())
  return new TextDisplayable({ path: svg, border, fill })
}

export default TextDisplayable
