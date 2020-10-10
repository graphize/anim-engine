import Displayable from './displayable'
import { IDisplayable } from '../../@types'

export class SVGDisplayable extends Displayable {}

export async function create(params: IDisplayable.ISVGParams) {
  const svg = await fetch(params.url).then((r) => r.text())
  return new SVGDisplayable({ path: svg })
}

export default SVGDisplayable
