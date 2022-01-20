import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import Product from '@models/Product'
import Review from '@models/Review'
import database from '@middlewares/database'
import auth, { IAuthExtendedRequest } from '@middlewares/auth'

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)
handler.use(auth)
handler.post<IAuthExtendedRequest>(async (req, res) => {
  try {
    const { review_id, pid } = req.body

    if (!review_id || !pid) {
      return res
        .status(400)
        .json({ success: false, message: '잘못된 요청입니다.' })
    }

    const deletedReview = await Review.findOneAndDelete({
      _id: review_id,
      user_id: req.user._id,
    }).exec()

    if (deletedReview) {
      await Product.findOneAndUpdate({ _id: pid }, { $inc: { reviews: -1 } })
    }

    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ success: false, message: '리뷰삭제 실패.', error })
  }
})

export default handler
