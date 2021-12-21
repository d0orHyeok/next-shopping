import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import Product from '@models/Product'
import database from '@middlewares/database'

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)

handler.post(async (req, res) => {
  try {
    // const { category } = req.body

    // if (!category) {
    //   return res.status(400).json({ success: false, message: '잘못된 요청' })
    // }

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
