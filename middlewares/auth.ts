import { IUserDocument } from '@models/User'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextHandler } from 'next-connect'
import { getSession } from 'next-auth/react'

export interface IAuthExtendedRequest {
  user: IUserDocument
}

const auth = async (
  req: IAuthExtendedRequest & NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
): Promise<void> => {
  try {
    const session = await getSession({ req })
    if (!session) {
      return res.status(400).json({ message: 'User not found' })
    }
    req.user = session.user
  } catch (error) {
    return next(error)
  }
  next()
}

export default auth
