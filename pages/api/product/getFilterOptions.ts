import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import Product, { IColor } from '@models/Product'
import database from '@middlewares/database'

export interface IFilterOptions {
  colorOptions: IColor[]
  fitOptions: string[]
  seasonOptions: string[]
}

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)

handler.post(async (req, res) => {
  try {
    const { category } = req.body

    if (!category) {
      return res.status(400).json({ success: false, message: '잘못된 요청' })
    }

    const colorOptions = await Product.find()
      .all('category', req.body.category)
      .select('colors')
      .distinct('colors')
      .exec()
    const fitOptions = await Product.find()
      .all('category', req.body.category)
      .select('fit')
      .distinct('fit')
      .exec()
    const seasonOptions = await Product.find()
      .all('category', req.body.category)
      .select('season')
      .distinct('season')
      .exec()

    const filterOptions = { colorOptions, fitOptions, seasonOptions }

    res.status(200).json({ success: true, filterOptions })
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
})

export default handler
