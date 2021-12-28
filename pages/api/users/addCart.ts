import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import User from '@models/User'
import database from '@middlewares/database'
import auth, { IAuthExtendedRequest } from '@middlewares/auth'

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)
handler.use(auth)

handler.post<IAuthExtendedRequest>(async (req, res) => {
  try {
    const { orders } = req.body

    if (!orders) {
      return res.status(400).json({ success: false, message: '잘못된 요청' })
    }

    const newUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { cart: [...req.user.cart, ...orders] } },
      { new: true }
    )

    res.status(200).json({ success: true, userCart: newUser?.cart })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error })
  }
})

export default handler
