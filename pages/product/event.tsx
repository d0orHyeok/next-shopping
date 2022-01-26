import EventProductViewPage, {
  IProductViewPageProps,
} from '@components/ProductViewPage/EventProductViewPage'
import { authCheckServerSide } from 'hoc/authCheck'
import { wrapper } from '@redux/store'
import { ParsedUrlQuery } from 'querystring'
import { IProduct } from '@models/Product'
import Axios from 'axios'
import Head from 'next/head'

interface IEventPageQuery extends ParsedUrlQuery {
  sort?: string
  colors?: string | string[]
  fit: string
  season: string
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    // 로그인 여부 확인
    await authCheckServerSide(store, context, null)

    const { sort, colors, fit, season } = context.query as IEventPageQuery

    let body = {}
    if (sort !== undefined) {
      const sortOption = sort.split('_')
      body = {
        ...body,
        sort: { [sortOption[0]]: sortOption[1] === 'asc' ? 1 : -1 },
      }
    }
    if (colors !== undefined) {
      body = { ...body, colors }
    }
    if (fit !== undefined) {
      body = { ...body, fit }
    }
    if (season !== undefined) {
      body = { ...body, season }
    }

    const response = await Axios.post('/api/product/findProducts', body)
    const products: IProduct[] = response.data?.products
    const filterRes = await Axios.post('/api/product/getFilterOptions', body)
    const filterOptions = filterRes.data.filterOptions

    return { props: { products, filterOptions } }
  }
)

const event = ({ products, filterOptions }: IProductViewPageProps) => {
  const metaDesc = products.map((product) => product.name).join(',')
  return (
    <>
      <Head>
        <title>EVENT | PIIC</title>
        <meta
          name="description"
          content={
            'Nextjs Cloth Shop, PIIC 온라인 의류 판매, ' +
            `PIIC 상품 목록, ${metaDesc}`
          }
        />
        <meta
          name="keywords"
          content={
            'nextjs,shop,website,PIIC,쇼핑,온라인쇼핑, 쇼핑몰, 의류, Event, NIGHT GLOW'
          }
        />
      </Head>
      <EventProductViewPage products={products} filterOptions={filterOptions} />
    </>
  )
}

export default event
