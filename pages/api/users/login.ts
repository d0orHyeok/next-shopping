import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import User, { IUserDocument } from '../../../models/User'
import database from '../../../middlewares/database'

const handler = nextConnect()

handler.use(database)
handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const user: IUserDocument = await User.findOne({ email: req.body.email })
    user.comparePassword(req.body.password)
    const loginUser = await user.generateToken()

    res.status(200).json({ success: true, id: loginUser._id })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ success: false, error })
  }
})

export default handler
