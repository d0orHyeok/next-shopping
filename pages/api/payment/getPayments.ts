import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import database from '@middlewares/database'
import Payment from '@models/Payment'
import dayjs from 'dayjs'

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)
handler.post(async (req, res) => {
  try {
    const tomorrow = dayjs(Date.now()).add(1, 'day')
    const { user_id, order_state, date_start, date_end, mode } = req.body

    if (!user_id) {
      return res
        .status(400)
        .json({ success: false, message: '잘못된 요청입니다.' })
    }

    let query = Payment.find({ user_id: user_id })

    if (date_start && date_end) {
      query = query.find({
        purchased_at: {
          $gte: date_start,
          $lt: dayjs(date_end).add(1, 'day').format('YYYY-MM-DD'),
        },
      })
    } else {
      query = query.find({
        purchased_at: {
          $gte: tomorrow.subtract(3, 'month').format('YYYY-MM-DD'),
          $lt: tomorrow.format('YYYY-MM-DD'),
        },
      })
    }

    if (mode !== 'refund') {
      query = query.find({
        orders: {
          $elemMatch: !order_state
            ? { refund_state: null }
            : { refund_state: null, order_state: order_state },
        },
      })
    } else {
      query = query.find({
        orders: {
          $elemMatch: {
            refund_state: order_state ? order_state : { $ne: null },
          },
        },
      })
    }

    const payments = await query
      .sort({ purchased_at: -1 })
      .populate('orders.pid')

    return res.status(200).json({ success: true, payments })
  } catch (error) {
    return res.status(500).json({ success: false, message: '서버오류', error })
  }
})

export default handler
