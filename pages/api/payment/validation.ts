import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import database from '@middlewares/database'
import { RestClient } from '@bootpay/server-rest-client'
import config from 'appConfig/config'

RestClient.setConfig(config.pay_app_rest_id, config.pay_app_privateKey)

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)

handler.post(async (req, res) => {
  try {
    const { data } = req.body

    if (data === undefined) {
      return res
        .status(400)
        .json({ success: false, message: '잘못된 요청입니다.' })
    }

    const response = await RestClient.getAccessToken()
    // Access Token을 발급 받았을 때
    if (response.status === 200 && response.data.token !== undefined) {
      const _response = await RestClient.verify(data.receipt_id)
      // 검증 결과를 제대로 가져왔을 때
      if (_response.status === 200) {
        // 원래 주문했던 금액이 일치하는가?
        // 그리고 결제 상태가 완료 상태인가?
        if (_response.data.price === 100 && _response.data.status === 1) {
          // TODO: 이곳이 상품 지급 혹은 결제 완료 처리를 하는 로직으로 사용하면 됩니다.
        }
      }
    }

    res.status(200).json({ success: true })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: '서버오류', error })
  }
})

export default handler
