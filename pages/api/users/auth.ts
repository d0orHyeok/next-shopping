import nextConnect from 'next-connect'
import { NextApiResponse } from 'next'
import database from '@middlewares/database'
import auth, { AuthNextApiRequestRequest } from '@middlewares/auth'

const handler = nextConnect()

handler.use(database)
handler.use(auth)

handler.get((req: AuthNextApiRequestRequest, res: NextApiResponse) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    role: req.user.role,
    image: req.user.image,
    cart: req.user.cart,
    history: req.user.history,
  })
})

export default handler
