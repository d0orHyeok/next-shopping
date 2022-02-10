import { IUserDocument } from '@models/User'
import { NextApiRequest, NextApiResponse } from 'next'
import { NextHandler } from 'next-connect'
import { getSession } from 'next-auth/react'
import User from '@models/User'

export interface IAuthExtendedRequest {
  user: IUserDocument & { _id: any }
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

    const user = await User.findOne({ _id: session.userData._id })

    if (!user) {
      return res.status(500).json({ message: 'Server Error, Cannot find user' })
    }

    req.user = user
  } catch (error) {
    return next(error)
  }
  next()
}

export default auth
