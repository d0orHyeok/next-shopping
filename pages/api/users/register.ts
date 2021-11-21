import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import User from '@models/User'
import database from '@middlewares/database'

const handler = nextConnect()

handler.use(database)
handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const user = new User(req.body)
    await user.save()

    res.status(200).json({ success: true })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ success: false, error })
  }
})

export default handler
