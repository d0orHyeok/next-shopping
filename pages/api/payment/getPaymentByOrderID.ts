import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import database from '@middlewares/database'
import Payment from '@models/Payment'

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)
handler.post(async (req, res) => {
  try {
    const { order_id } = req.body

    if (!order_id) {
      return res
        .status(400)
        .json({ success: false, message: '잘못된 요청입니다.' })
    }

    const payment = await Payment.findOne({ order_id: order_id }).populate(
      'orders.pid'
    )

    return res.status(200).json({ success: true, payment })
  } catch (error) {
    return res.status(500).json({ success: false, message: '서버오류', error })
  }
})

export default handler
