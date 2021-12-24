import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import Product from '@models/Product'
import database from '@middlewares/database'

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)

handler.get(async (req, res) => {
  try {
    const colors = await Product.find()
      .select('colors')
      .distinct('colors')
      .exec()

    res.status(200).json({ success: true, colors })
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
})

export default handler
