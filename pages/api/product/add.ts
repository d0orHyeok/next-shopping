import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import Product from '@models/Product'
import database from '@middlewares/database'

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)

handler.post(async (req, res) => {
  try {
    const product = new Product(req.body)
    await product.save()

    res.status(200).json({ success: true, message: '상품이 등록되었습니다.' })
  } catch (error) {
    res.status(500).json({ success: false, message: '상품등록 실패.', error })
  }
})

export default handler
