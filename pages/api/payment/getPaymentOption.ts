import { IPaymentOrder } from './../../../models/Payment'
import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import database from '@middlewares/database'
import Payment from '@models/Payment'
import Review from '@models/Review'
import auth, { IAuthExtendedRequest } from '@middlewares/auth'
import dayjs from 'dayjs'

interface ICheckPurchasedBody {
  pid: string
}

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)
handler.use(auth)
handler.post<IAuthExtendedRequest>(async (req, res) => {
  try {
    const { pid } = req.body as ICheckPurchasedBody
    const { user } = req

    if (!pid) {
      return res
        .status(400)
        .json({ success: false, message: '잘못된 요청입니다.' })
    }

    const payments = await Payment.find({
      user_id: user._id,
      purchased_at: {
        $gte: dayjs(Date.now()).subtract(1, 'month').format('YYYY-MM-DD'),
      },
      'orders.pid': pid,
    }).exec()

    if (payments.length) {
      const reviews = await Review.find({
        user_id: req.user._id,
        pid: pid,
      }).exec()

      let paymentOrders: IPaymentOrder[] = []
      payments.forEach((payment) => {
        paymentOrders = [
          ...paymentOrders,
          ...payment.orders.filter(
            (order: IPaymentOrder) => order.pid.toString() === pid
          ),
        ]
      })

      const newReviewedOrders = paymentOrders.filter(
        (order) =>
          !reviews.find(
            (review) =>
              JSON.stringify(order.option) === JSON.stringify(review.option)
          )
      )

      if (!newReviewedOrders.length) {
        return res.status(200).json({ success: true, option: null })
      }

      return res
        .status(200)
        .json({ success: true, option: newReviewedOrders[0].option })
    } else {
      return res.status(400).json({
        success: false,
        message: '한달 이내의 해당상품에 대한 결제내역이 존재하지 않습니다.',
      })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: '서버오류', error })
  }
})

export default handler
