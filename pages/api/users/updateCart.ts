import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import User, { IUserCart } from '@models/User'
import database from '@middlewares/database'
import auth, { IAuthExtendedRequest } from '@middlewares/auth'

export interface IUpdateCartBody {
  index: number
  update: IUserCart
}

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)
handler.use(auth)

handler.post<IAuthExtendedRequest>(async (req, res) => {
  try {
    const { index, update } = req.body as IUpdateCartBody

    if (index === undefined || update === undefined) {
      return res.status(400).json({ success: false, message: '잘못된 요청' })
    }

    const newCart = req.user.cart.map((order, i) => {
      if (i === index) {
        return update
      } else {
        return order
      }
    })
    const newUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $set: { cart: newCart } },
      { new: true }
    )

    res.status(200).json({ success: true, userCart: newUser?.cart })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error })
  }
})

export default handler
