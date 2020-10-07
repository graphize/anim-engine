import TexDisplayable from './texdisplayable'
import { IDisplayable } from '../../@types'
import { SERVER_URL } from '../constants'

export class TextDisplayable extends TexDisplayable {
  public static async _getAsyncData({
    value,
  }: IDisplayable.ITexParams): Promise<IDisplayable.ITexAsyncData> {
    const svg = await fetch(`${SERVER_URL}/text/${btoa(value)}`).then((r) =>
      r.text()
    )

    return { path: svg }
  }

  public static async create(params: IDisplayable.ITexParams) {
    const d = await TextDisplayable._getAsyncData(params)
    const displayable = new TextDisplayable({ ...params, ...d })
    return displayable
  }
}

export default TextDisplayable
