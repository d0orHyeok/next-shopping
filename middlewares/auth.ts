import { NextApiRequest, NextApiResponse } from 'next'
import { NextHandler } from 'next-connect'
import User, { IUserDocument } from '@models/User'

export interface iAuthNextApiRequestRequest extends NextApiRequest {
  user: IUserDocument
}

const auth = async (
  req: iAuthNextApiRequestRequest,
  res: NextApiResponse,
  next: NextHandler
): Promise<void> => {
  try {
    const token = req.cookies.w_auth
    const user = await User.findByToken(token)
    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }
    req.user = user
  } catch (error) {
    return next(error)
  }
  next()
}

export default auth
