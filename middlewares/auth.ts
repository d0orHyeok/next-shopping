import { NextApiRequest, NextApiResponse } from 'next'
import { NextHandler } from 'next-connect'
import User from '@models/User'

const auth = async (
  _0: NextApiRequest,
  _1: NextApiResponse,
  next: NextHandler
): Promise<void> => {
  try {
    User.findByToken
  } catch (error) {
    console.log('auth error ', error.message)
  }
  next()
}

export default auth
