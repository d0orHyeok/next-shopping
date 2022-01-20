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
    const { review_id, update } = req.body

    if (!review_id || !update) {
      return res
        .status(400)
        .json({ success: false, message: '잘못된 요청입니다.' })
    }

    const { score, content, user_size, images } = update
    const review = await Review.findOne({ _id: review_id })
      .populate('user_id', 'name')
      .exec()

    if (review !== null) {
      review.score = score
      review.content = content
      review.user_size = user_size
      review.images = images

      const editReview = await review.save()

      return res.status(200).json({ success: true, editReview })
    } else {
      return res
        .status(500)
        .json({ success: false, message: '리뷰 수정 실패.' })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: '리뷰 수정 실패.', error })
  }
})

export default handler
