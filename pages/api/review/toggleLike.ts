import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import Review from '@models/Review'
import database from '@middlewares/database'
import auth, { IAuthExtendedRequest } from '@middlewares/auth'

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)
handler.use(auth)
handler.post<IAuthExtendedRequest>(async (req, res) => {
  try {
    const { review_id } = req.body

    if (!review_id) {
      return res
        .status(400)
        .json({ success: false, message: '잘못된 요청입니다.' })
    }

    const review = await Review.findOne({ _id: review_id })
      .populate('user_id')
      .exec()
    if (review) {
      const index = review.likes.findIndex(
        (uid) => uid.toString() === req.user._id.toString()
      )

      if (index === -1) {
        review.likes.push(req.user._id)
      } else {
        review.likes.splice(index, 1)
      }

      const updateReview = await review.save()

      return res.status(200).json({ success: true, review: updateReview })
    } else {
      return res.status(400).json({ success: false, message: '실패했습니다.' })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: '실패했습니다.', error })
  }
})

export default handler
