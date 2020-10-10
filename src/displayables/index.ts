import { Displayable } from './displayable'
import {
  SVGDisplayable as _SVGDisplayable,
  create as createSVGD,
} from './svgDisplayable'
import {
  TexDisplayable as _TexDisplayable,
  create as createTexD,
} from './texDisplayable'
import {
  TextDisplayable as _TextDisplayable,
  create as createTextD,
} from './textDisplayable'

export { Displayable }

export const TexDisplayable = { ..._TexDisplayable, create: createTexD }
export const TextDisplayable = { ..._TextDisplayable, create: createTextD }
export const SVGDisplayable = { ..._SVGDisplayable, create: createSVGD }
