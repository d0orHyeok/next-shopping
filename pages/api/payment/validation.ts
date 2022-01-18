import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import database from '@middlewares/database'
import { RestClient } from '@bootpay/server-rest-client'
import config from 'appConfig/config'
import Payment from '@models/Payment'
import auth, { IAuthExtendedRequest } from '@middlewares/auth'

RestClient.setConfig(config.pay_app_rest_id, config.pay_app_privateKey)

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)
handler.use(auth)
handler.post<IAuthExtendedRequest>(async (req, res) => {
  try {
    const { data, orders } = req.body

    if (data === undefined || orders === undefined) {
      return res
        .status(400)
        .json({ success: false, message: '잘못된 요청입니다.' })
    }

    const response = await RestClient.getAccessToken()
    // Access Token을 발급 받았을 때
    if (response.status !== 200 || response.data.token === undefined) {
      return res
        .status(500)
        .json({ sucess: false, message: '검증하는데 실패했습니다.' })
    }

    const _response = await RestClient.verify(data.receipt_id)
    if (_response.data.status !== 1) {
      return res
        .status(500)
        .json({ sucess: false, message: '검증하는데 실패했습니다.' })
    }
    // 검증 결과를 제대로 가져왔을 때
    // 원래 주문했던 금액이 일치하는가? 그리고 결제 상태가 완료 상태인가?
    if (_response.data.price !== data.price) {
      return res
        .status(400)
        .json({ success: false, message: '결제정보가 일치하지 않습니다.' })
    }
    // TODO: 이곳이 상품 지급 혹은 결제 완료 처리를 하는 로직으로 사용하면 됩니다.
    // DB에 결제내역 저장

    const {
      receipt_id,
      order_id,
      name,
      price,
      method,
      method_name,
      payment_data,
      purchased_at,
      receipt_url,
    } = _response.data

    const newPayment = new Payment({
      receipt_id,
      order_id,
      order_name: data.order_name,
      user_id: req.user._id,
      delivery_info: data.delivery_info,
      payment_name: name,
      price,
      method,
      method_name,
      card_name: payment_data.card_name,
      card_no: payment_data.card_no,
      purchased_at,
      receipt_url,
      orders,
    })
    await newPayment.save()

    return res.status(200).json({ success: true, order_id })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: '서버오류', error })
  }
})

export default handler
