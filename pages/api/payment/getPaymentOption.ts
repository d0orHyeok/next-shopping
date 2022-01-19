import { IPaymentDocument } from './../../../models/Payment'
import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import database from '@middlewares/database'
import Payment from '@models/Payment'
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

    const payment: IPaymentDocument | null = await Payment.find({
      user_id: user._id,
      purchased_at: {
        $gte: dayjs(Date.now()).subtract(1, 'month').format('YYYY-MM-DD'),
      },
    })
      .findOne({ 'orders.pid': pid })
      .exec()

    if (payment) {
      const order = payment.orders.find((order) => order.pid.toString() === pid)

      return res.status(200).json({ success: true, option: order?.option })
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
