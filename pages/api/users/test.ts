import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import User from '../../../models/User'
import database from '../../../middlewares/database'

const handler = nextConnect()

handler.use(database)
handler.get(async (_1: NextApiRequest, res: NextApiResponse) => {
  try {
    const quotes = await User.findOne({ name: 'd0oR' })
    res.status(200).json(quotes)
  } catch (error) {
    console.log(error.message)

    res.status(500).json({ message: 'Server Error' })
  }
})

export default handler
