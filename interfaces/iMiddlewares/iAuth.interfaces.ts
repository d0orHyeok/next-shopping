import { NextApiRequest } from 'next'
import { IUserDocument } from '@interfaces/iModels/iUser.interfaces'

export interface iAuthNextApiRequestRequest extends NextApiRequest {
  user: IUserDocument
}
