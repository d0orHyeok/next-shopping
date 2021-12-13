import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import Product from '@models/Product'
import database from '@middlewares/database'

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)

handler.get(async (req, res) => {
  try {
    const limit = 10

    const newProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec()

    return res.status(200).json({ success: true, newProducts })
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
})

export default handler
