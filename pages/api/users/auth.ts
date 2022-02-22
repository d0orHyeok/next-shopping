import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import database from '@middlewares/database'
import auth, { IAuthExtendedRequest } from '@middlewares/auth'
import { IUserDocument, IDeliveryAddr, IUserCart } from '@models/User'

export interface IAuthUserData {
  _id: string
  isAdmin: boolean
  email: string
  name: string
  role: number
  image: string
  deliveryAddrs: IDeliveryAddr[]
  likes: string[]
  cart: IUserCart[]
}

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)
handler.use(auth)
handler.get<IAuthExtendedRequest>((req, res) => {
  const userData: IUserDocument = req.user

  res.status(200).json({
    _id: userData._id,
    isAdmin: userData.role === 0 ? false : true,
    email: userData.email,
    name: userData.name,
    role: userData.role,
    image: userData.image,
    deliveryAddrs: userData.deliveryAddrs,
    likes: userData.likes,
    cart: userData.cart,
  })
})

export default handler
