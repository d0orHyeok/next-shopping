import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import User from '@models/User'
import Product from '@models/Product'
import database from '@middlewares/database'
import auth, { IAuthExtendedRequest } from '@middlewares/auth'

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)
handler.use(auth)

handler.post<IAuthExtendedRequest>(async (req, res) => {
  try {
    const { pid } = req.body

    if (!pid === undefined) {
      return res.status(400).json({ success: false, message: '잘못된 요청' })
    }

    const newUser = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { likes: { $each: pid } } },
      { new: true }
    )
    await Product.updateMany(
      { _id: { $in: pid } },
      { $push: { likes: req.user._id } }
    )

    res.status(200).json({ success: true, userLikes: newUser?.likes })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error })
  }
})

export default handler
