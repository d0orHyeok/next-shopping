import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import Product from '@models/Product'
import database from '@middlewares/database'
import auth, { IAuthExtendedRequest } from '@middlewares/auth'

interface IBody {
  pid: string[]
}

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)
handler.use(auth)
handler.post<IAuthExtendedRequest>(async (req, res) => {
  try {
    const { pid } = req.body as IBody

    if (!pid) {
      return res.status(400).json({ success: false, message: '잘못된 요청' })
    }

    const { user } = req

    user.likes = user.likes.filter((like) => !pid.includes(like.toString()))
    const newUser = await user.save()

    await Product.updateMany(
      { _id: { $in: pid } },
      { $pull: { likes: user._id } }
    )

    res.status(200).json({ success: true, userLikes: newUser.likes })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error })
  }
})

export default handler
