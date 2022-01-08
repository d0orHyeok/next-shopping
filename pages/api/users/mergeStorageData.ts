import { IUserCart } from './../../../models/User'
import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import Product from '@models/Product'
import database from '@middlewares/database'
import auth, { IAuthExtendedRequest } from '@middlewares/auth'

interface IBody {
  storageLikes: string[]
  storageCart: IUserCart[]
}

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)
handler.use(auth)
handler.post<IAuthExtendedRequest>(async (req, res) => {
  try {
    const { storageLikes, storageCart } = req.body as IBody

    if (!storageLikes || !storageCart) {
      return res.status(400).json({ success: false, message: '잘못된 요청' })
    }

    const { user } = req
    const { likes, cart } = user

    if (storageLikes.length) {
      const newLikes = storageLikes.filter((like) => likes.includes(like))
      user.likes = [...likes, ...newLikes]

      await Product.updateMany(
        { _id: { $in: newLikes } },
        { $push: { likes: user._id } }
      )
    }

    if (storageCart.length) {
      const newCart = cart
      storageCart.forEach((order) => {
        const index = cart.findIndex(
          (userOrder) =>
            userOrder.pid === order.pid &&
            JSON.stringify(userOrder.option) === JSON.stringify(order.option)
        )
        if (index === -1) {
          newCart.push(order)
        } else {
          newCart[index].qty += order.qty
        }
      })
      user.cart = newCart
    }

    const newUser = await user.save()

    res.status(200).json({
      success: true,
      mergeData: { likes: newUser.likes, cart: newUser.cart },
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error })
  }
})

export default handler
