import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import database from '@middlewares/database'
import { RestClient } from '@bootpay/server-rest-client'
import Payment from '@models/Payment'
import Product from '@models/Product'
import auth, { IAuthExtendedRequest } from '@middlewares/auth'

interface IUpdate {
  pid: string
  update: any
}

const restID: string | undefined = process.env.PAY_APP_REST_ID
const privateKEy: string | undefined = process.env.PAY_APP_PRIVATEKEY

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)
handler.use(auth)
handler.post<IAuthExtendedRequest>(async (req, res) => {
  const { payment_id, refund_reason } = req.body

  if (!payment_id || !refund_reason) {
    return res
      .status(400)
      .json({ success: false, message: '잘못된 요청입니다.' })
  }
  try {
    if (!restID || !privateKEy) {
      throw new Error(
        'Please define the restID & privateKEy  environment variable inside .env.local'
      )
    }
    RestClient.setConfig(restID, privateKEy)

    const response = await RestClient.getAccessToken()
    // Access Token을 발급 받았을 때
    if (response.status !== 200 || response.data.token === undefined) {
      return res
        .status(500)
        .json({ sucess: false, message: '검증하는데 실패했습니다.' })
    }

    const payment = await Payment.findOne({ _id: payment_id }).exec()

    if (!payment) {
      return res.status(500).json({ success: false, message: '환불요청 실패' })
    }

    const _response = await RestClient.cancel({
      receiptId: payment.receipt_id,
      price: payment.price,
      name: req.user.name,
      reason: refund_reason,
    })

    if (_response.status !== 200) {
      return res.status(500).json({ sucess: false, message: '환불요청 실패' })
    }

    const updates: IUpdate[] = []
    payment.orders.forEach((order, index) => {
      payment.orders[index].refund_state = 'cancel'
      updates.push({
        pid: order.pid,
        update: { $inc: { sold: -1 * order.qty } },
      })
    })
    await payment.save()

    await Promise.all(
      updates.map((update) =>
        Product.findOneAndUpdate({ _id: update.pid }, update.update).exec()
      )
    )

    return res.status(200).json({ success: true })
  } catch (error) {
    console.log(error)
    if (error.message === '이미 취소된 거래건 입니다.') {
      const payment = await Payment.findOne({ _id: payment_id }).exec()
      if (payment !== null) {
        const updates: IUpdate[] = []
        payment.orders.forEach((order, index) => {
          payment.orders[index].refund_state = 'cancel'
          updates.push({
            pid: order.pid,
            update: { $inc: { sold: -1 * order.qty } },
          })
        })
        await payment.save()

        await Promise.all(
          updates.map((update) =>
            Product.findOneAndUpdate({ _id: update.pid }, update.update).exec()
          )
        )
      }
    }
    return res.status(500).json({
      success: false,
      message: error.message ? error.message : '서버오류',
      error,
    })
  }
})

export default handler
