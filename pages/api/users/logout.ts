import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import User from '../../../models/User'
import database from '../../../middlewares/database'

const handler = nextConnect()

handler.use(database)
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await User.findOneAndUpdate({ name: 'd0oR' }, { token: '', tokenExp: 0 })
    res.status(200).json({ success: true })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ success: false, error })
  }
})

export default handler
