import nextConnect from 'next-connect'
import { NextApiRequest, NextApiResponse } from 'next'
import Product, { IColor } from '@models/Product'
import database from '@middlewares/database'

const handler = nextConnect<NextApiRequest, NextApiResponse>()
handler.use(database)

handler.post(async (req, res) => {
  try {
    const { category, colors, fit, season } = req.body

    // 카테고리가 없을 경우
    if (!category) {
      return res.status(400).json({ success: false, message: '잘못된 요청' })
    }

    const buildQuery = () => {
      return category[0] === 'best'
        ? Product.find().sort({ sold: -1, createdAt: -1 }).limit(10)
        : Product.find()
            .all('category', [category[0]])
            .sort({ sold: -1, createdAt: -1 })
            .limit(10)
    }

    const tempProducts = await buildQuery()
    const getFilterProducts = () => {
      let filterProducts = tempProducts

      // 각 필터에 맞춘 query 실행
      if (colors) {
        // colors query를 split 하여 데이터로 만든후 탐색
        let queryColors: IColor[] = []
        if (Array.isArray(colors)) {
          queryColors = colors.map((item) => {
            const data = item.split('_')
            return { colorName: data[0], colorHex: data[1] }
          })
        } else {
          const data = colors.split('_')
          queryColors = [{ colorName: data[0], colorHex: data[1] }]
        }

        filterProducts = filterProducts.filter(
          (product) =>
            product.colors.filter((color) =>
              queryColors.some(
                (c) =>
                  c.colorName === color.colorName &&
                  c.colorHex === color.colorHex
              )
            ).length !== 0
        )
      }

      // fit filter
      if (fit) {
        filterProducts = filterProducts.filter((product) => product.fit === fit)
      }
      // season filter
      if (season) {
        const seasonFilter = Array.isArray(season) ? season : [season]
        filterProducts = filterProducts.filter(
          (product) =>
            product.season.filter((item) => seasonFilter.includes(item))
              .length !== 0
        )
      }

      return filterProducts
    }

    const distinctArray = (array: any[]) => {
      const map = new Map() // 맵
      array.forEach((item) => {
        map.set(JSON.stringify(item), item) // name, company가 모두 같은 객체 요소는 제외한 맵 생성
      })

      return Array.from(map, ([_, value]) => value)
    }

    const products = getFilterProducts()

    const colorOptions = distinctArray(
      (await buildQuery().select('colors').exec())
        .map((item) => item.colors)
        .flat()
    )
    const fitOptions = distinctArray(
      (await buildQuery().select('fit').exec()).map((item) => item.fit)
    )
    const seasonOptions = distinctArray(
      (await buildQuery().select('season').exec())
        .map((item) => item.season)
        .flat()
    )

    let fitIsBlock = fitOptions.map((_) => false)
    let seasonIsBlock = seasonOptions.map((_) => false)

    if (colors || season || fit) {
      const fitSelectOption = distinctArray(products.map((item) => item.fit))
      const seasonSelectOptions = distinctArray(
        products.map((item) => item.season).flat()
      )

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

    res.status(200).json({ success: true, products, filterOptions })
  } catch (error) {
    res.status(500).json({ success: false, error })
  }
})

export default handler
