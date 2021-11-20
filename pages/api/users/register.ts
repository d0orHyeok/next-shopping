import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import User from '../../../models/User'
import database from '../../../middlewares/database'

const handler = nextConnect()

handler.use(database)
handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const user = new User(req.body)

    const result = await user.save()

    res.status(200).json({ message: result })
  } catch (error) {
    console.log(error.message)

    res.status(500).json({ message: 'Server Error' })
  }
})

export default handler
