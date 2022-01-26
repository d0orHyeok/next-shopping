import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import Product, { IColor } from '@models/Product'
import database from '@middlewares/database'

export interface IFilterOptions {
  colorOptions: IColor[]
  fitOptions: string[]
  seasonOptions: string[]
  isBlock: IIsBlock
}

interface IIsBlock {
  fitIsBlock: boolean[]
  seasonIsBlock: boolean[]
}

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)

handler.post(async (req, res) => {
  try {
    const { keyword, category, colors, fit, season, is_event } = req.body

    if (category ^ keyword ^ is_event) {
      return res.status(400).json({ success: false, message: '잘못된 요청' })
    }

    const buildQuery = () => {
      return category
        ? Product.find().all('category', category)
        : keyword
        ? Product.find({ name: { $regex: keyword, $options: 'i' } })
        : Product.find({ is_event: true })
    }

    const buildFilterQuery = () => {
      let query = buildQuery()

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

      return query
    }

    const colorOptions = await buildQuery().distinct('colors').exec()
    const fitOptions = await buildQuery().distinct('fit').exec()
    const seasonOptions = await buildQuery().distinct('season').exec()

    let fitIsBlock = fitOptions.map((_) => false)
    let seasonIsBlock = seasonOptions.map((_) => false)

    if (colors || season || fit) {
      const fitSelectOption = await buildFilterQuery()
        .select('fit')
        .distinct('fit')
        .exec()
      const seasonSelectOptions = await buildFilterQuery()
        .select('season')
        .distinct('season')
        .exec()

      fitIsBlock = fitOptions.map((option) => !fitSelectOption.includes(option))
      seasonIsBlock = seasonOptions.map(
        (option) => !seasonSelectOptions.includes(option)
      )
    }

    const filterOptions = {
      colorOptions,
      fitOptions,
      seasonOptions,
      isBlock: { fitIsBlock, seasonIsBlock },
    }

    res.status(200).json({ success: true, filterOptions })
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
})

export default handler
