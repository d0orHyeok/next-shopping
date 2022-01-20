import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import Review from '@models/Review'
import database from '@middlewares/database'

interface IBody {
  pid: string
  sort: string
  filter: {
    tall?: number[]
    weight?: number[]
    top?: string[]
    bottom?: number[]
  }
}

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)
handler.post(async (req, res) => {
  try {
    const { pid, sort, filter } = req.body as IBody

    if (!pid) {
      return res
        .status(400)
        .json({ success: false, message: '잘못된 요청입니다.' })
    }

    let query = Review.find({ pid: pid })

    if (filter) {
      const { tall, weight, top, bottom } = filter
      if (tall) {
        query = query.find({ 'user_size.tall': { $in: tall } })
      }
      if (weight) {
        query = query.find({ 'user_size.weight': { $in: weight } })
      }
      if (top) {
        query = query.find({ 'user_size.top': { $in: top } })
      }
      if (bottom) {
        query = query.find({ 'user_size.bottom': { $in: bottom } })
      }
    }

    const reviews = await query
      .sort(!sort ? { createdAt: -1 } : { [sort]: -1 })
      .populate('user_id', 'name')
      .exec()

    res.status(200).json({ success: true, reviews })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, error })
  }
})

export default handler
