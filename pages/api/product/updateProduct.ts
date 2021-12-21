import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import Product from '@models/Product'
import database from '@middlewares/database'
import { IProduct } from '@models/Product'

export interface IProductDetail {
  product: IProduct
}

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)

handler.post(async (req, res) => {
  try {
    const { pid, update } = req.body

    if (!pid || !update) {
      return res
        .status(400)
        .json({ success: false, message: '잘못된 요청입니다.' })
    }

    await Product.findOneAndUpdate({ _id: pid }, update)

    res.status(200).json({ success: true })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error })
  }
})

export default handler
