import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import Product from '@models/Product'
import database from '@middlewares/database'

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)

handler.get(async (req, res) => {
  try {
    const limit = req.query?.limit ? parseInt(req.query.limit.toString()) : 10
    const category = req.query?.category

    if (!category) {
      return res
        .status(500)
        .json({ success: false, message: 'Invalid filter option' })
    }

    const products = await Product.find()
      .all('category', [category])
      .sort('-sold')
      .limit(limit)
      .exec()

    res.status(200).json({ success: true, products })
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
})

export default handler
