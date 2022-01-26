import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import Product from '@models/Product'
import database from '@middlewares/database'

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)

handler.post(async (req, res) => {
  try {
    const { sort, category, colors, fit, season, keyword, is_event } = req.body

    // 잘못된 요청일 경우
    if (keyword ^ category ^ is_event) {
      return res.status(400).json({ success: false, message: '잘못된 요청' })
    }

    let query = category
      ? Product.find().all('category', category)
      : keyword
      ? Product.find({ name: { $regex: keyword, $options: 'i' } })
      : Product.find({ is_event: true })

    // 정렬옵션이 있으면 그에 맞게 설정
    const sortOption =
      !sort || sort?.sold
        ? { sold: -1, reviews: -1, views: -1, createdAt: -1 }
        : sort

    query = query.sort(sortOption)

    // 각 필터에 맞춘 query 실행
    if (colors) {
      // colors query를 split 하여 데이터로 만든후 탐색
      let queryColors = []
      if (Array.isArray(colors)) {
        queryColors = colors.map((item) => {
          const data = item.split('_')
          return { colorName: data[0], colorHex: data[1] }
        })
      } else {
        const data = colors.split('_')
        queryColors = [{ colorName: data[0], colorHex: data[1] }]
      }

      query = query.where('colors').in(queryColors)
    }
    // fit filter
    if (fit) {
      query = query.where('fit').equals(fit)
    }
    // season filter
    if (season) {
      query = Array.isArray(season)
        ? query.where('season').in(season)
        : query.where('season').in([season])
    }

    const products = await query.exec()

    res.status(200).json({ success: true, products })
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
})

export default handler
