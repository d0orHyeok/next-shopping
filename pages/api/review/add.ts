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
  if (!req.body.review) {
    return res
      .status(400)
      .json({ success: false, message: '잘못된 요청입니다.' })
  }

  try {
    const review = new Review(req.body.review)
    await review.save()

    await Product.findOneAndUpdate(
      { _id: review.pid },
      { $inc: { reviews: 1 } }
    )

    res.status(200).json({ success: true, review })
  } catch (error) {
    res.status(500).json({ success: false, message: '상품등록 실패.', error })
  }
})

export default handler
