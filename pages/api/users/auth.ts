import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import database from '@middlewares/database'
import auth, { IAuthExtendedRequest } from '@middlewares/auth'
import { IUserDocument, IUser } from '@models/User'
import dayjs from 'dayjs'

export interface IAuthUserData extends IUser {
  _id: string
  isAdmin: boolean
}

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)
handler.use(auth)
handler.post<IAuthExtendedRequest>((req, res) => {
  let userData: IUserDocument = req.user
  if (req.user.tokenExp < dayjs(Date.now()).add(10, 'minute').valueOf()) {
    req.user.generateToken((err, user: IUserDocument) => {
      if (err) {
        return res.status(500).json({ err })
      }
      res.setHeader(
        'Set-Cookie',
        `w_auth=${user.token}; Max-Age=3600; Path=/; HttpOnly; Secure; SameSite=None`
      )
      userData = user
    })
  }
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
    tokenExp: userData.tokenExp,
  })
})

export default handler
