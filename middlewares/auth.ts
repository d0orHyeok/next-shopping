import { NextApiRequest, NextApiResponse } from 'next'
import { NextHandler } from 'next-connect'
import User, { IUserDocument } from '@models/User'

export interface AuthNextApiRequestRequest extends NextApiRequest {
  token?: string
  user?: IUserDocument
}

const auth = async (
  req: AuthNextApiRequestRequest,
  res: NextApiResponse,
  next: NextHandler
): Promise<void> => {
  try {
    const token = req.cookies.w_auth
    const user = await User.findByToken(token)

    if (!user) {
      return res.json({ isAuth: false, error: true })
    }
    req.token = token
    req.user = user
  } catch (error) {
    console.log('auth error ', error.message)
  }
  next()
}

export default auth
