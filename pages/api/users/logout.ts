import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import User from '@models/User'
import database from '@middlewares/database'
import auth, { IAuthExtendedRequest } from '@middlewares/auth'

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)
handler.use(auth)

handler.get<IAuthExtendedRequest>(async (req, res) => {
  try {
    await User.findOneAndUpdate(
      { _id: req.user._id },
      { token: '', tokenExp: 0 }
    )
    res.setHeader('Set-Cookie', 'w_auth=""; Max-Age=-1')
    res.status(200).json({ success: true, message: '로그아웃 성공' })
  } catch (error) {
    res.status(500).json({ error })
  }
})

export default handler
