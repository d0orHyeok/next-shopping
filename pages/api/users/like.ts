import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import User, { IUserDocument } from '@models/User'
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

    const isAdd =
      (await User.findOne({ _id: req.user._id }).where('likes').in([pid])) ===
      null

    let newUser: IUserDocument | null = null

    if (isAdd) {
      newUser = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { likes: pid } },
        { new: true }
      )
      await Product.findOneAndUpdate(
        { _id: pid },
        { $push: { likes: req.user._id } },
        { new: true }
      )
    } else {
      newUser = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $pull: { likes: pid } },
        { new: true }
      )
      await Product.findOneAndUpdate(
        { _id: pid },
        { $pull: { likes: req.user._id } },
        { new: true }
      )
    }

    res.status(200).json({ success: true, userLikes: newUser?.likes })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error })
  }
})

export default handler
