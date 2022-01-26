import { IProduct } from '@models/Product'
import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import Product from '@models/Product'
import database from '@middlewares/database'
import { getMainCategorys } from '@libs/getCategory'

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)

interface BestProduct {
  mainCategory: string
  products: IProduct[]
}

handler.get(async (req, res) => {
  try {
    const limit = 10
    const categorys = ['best', ...getMainCategorys()]

    const results = await Promise.all(
      categorys.map((category) => {
        const request =
          category === 'best'
            ? Product.find()
                .sort({ sold: -1, reviews: -1, views: -1, createdAt: -1 })
                .limit(limit)
                .exec()
            : Product.find()
                .all('category', [category])
                .sort({ sold: -1, reviews: -1, views: -1, createdAt: -1 })
                .limit(limit)
                .exec()
        return request
      })
    )

    const bestProducts: BestProduct[] = []
    results.forEach((result, index) => {
      bestProducts.push({ mainCategory: categorys[index], products: result })
    })

    return res.status(200).json({ success: true, bestProducts })
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
})

export default handler
