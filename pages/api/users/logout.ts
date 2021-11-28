import nextConnect from 'next-connect'
import { NextApiResponse } from 'next'
import User from '@models/User'
import database from '@middlewares/database'
import auth, { AuthNextApiRequestRequest } from '@middlewares/auth'

const handler = nextConnect()

handler.use(database)
handler.use(auth)

handler.get(async (req: AuthNextApiRequestRequest, res: NextApiResponse) => {
  try {
    console.log(req.user?._id)
    await User.findOneAndUpdate(
      { _id: req.user?._id },
      { token: '', tokenExp: 0 }
    )
    res.setHeader('Set-Cookie', 'w_auth=""; Max-Age=-1')
    res.status(200).json({ success: true, message: 'logout success' })
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
})

export default handler
