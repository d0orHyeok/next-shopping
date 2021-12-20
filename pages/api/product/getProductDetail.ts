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
    const { pid } = req.body

    const product = await Product.findById(pid).exec()

    const productDetail = { product }

    res.status(200).json({ success: true, productDetail })
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
})

export default handler
