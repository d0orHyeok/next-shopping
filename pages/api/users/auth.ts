import nextConnect from 'next-connect'
import { NextApiResponse } from 'next'
import database from '@middlewares/database'
import auth, { iAuthNextApiRequestRequest } from '@middlewares/auth'
import { IUserDocument } from '@models/User'
import dayjs from 'dayjs'

const handler = nextConnect()
handler.use(database)
handler.use(auth)
handler.post((req: iAuthNextApiRequestRequest, res: NextApiResponse) => {
  if (req.user.tokenExp < dayjs(Date.now()).add(10, 'minute').valueOf()) {
    req.user.generateToken((err, user: IUserDocument) => {
      if (err) {
        return res.status(500).json({ err })
      }
      res.setHeader(
        'Set-Cookie',
        `w_auth=${user.token}; Max-Age=3600; Path=/; HttpOnly; Secure; SameSite=None`
      )
      res.status(200).json({
        _id: user._id,
        isAdmin: user.role === 0 ? false : true,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
        cart: user.cart,
        history: user.history,
        tokenExp: user.tokenExp,
      })
    })
  } else {
    res.status(200).json({
      _id: req.user._id,
      isAdmin: req.user.role === 0 ? false : true,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      image: req.user.image,
      cart: req.user.cart,
      history: req.user.history,
      tokenExp: req.user.tokenExp,
    })
  }
})

export default handler
