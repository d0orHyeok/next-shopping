import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import Product, { IProduct } from '@models/Product'
import database from '@middlewares/database'
import { IUserCart } from '@models/User'

interface Ibody {
  orders: IUserCart[]
}

export interface IUserProduct extends IUserCart {
  product: IProduct
}

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)

handler.post(async (req, res) => {
  try {
    const { orders } = req.body as Ibody

    if (!orders) {
      return res.status(400).json({ success: false, message: '잘못된 요청' })
    }
    const products = await Product.find({
      _id: { $in: orders.map((order) => order.pid) },
    }).exec()

    const userProducts = orders.map((order) => {
      const product = products.find((p) => p._id.toString() === order.pid)
      return { ...order, product }
    })

    res.status(200).json({ success: true, userProducts })
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
})

export default handler
