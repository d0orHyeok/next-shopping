import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import database from '@middlewares/database'
import auth, { IAuthExtendedRequest } from '@middlewares/auth'

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)
handler.use(auth)
handler.post<IAuthExtendedRequest>(async (req, res) => {
  try {
    const { update } = req.body

    if (update === undefined) {
      return res.status(400).json({ success: false, message: '잘못된 요청' })
    }

    const { user } = req

    user.deliveryAddrs = update

    const newUser = await user.save()

    res
      .status(200)
      .json({ success: true, newDeliveryAddrs: newUser?.deliveryAddrs })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error })
  }
})

export default handler
