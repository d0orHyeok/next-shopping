import { authCheckServerSide } from 'hoc/authCheck'
import { wrapper } from '@redux/store'
import { ParsedUrlQuery } from 'querystring'
import Axios from 'axios'
import Head from 'next/head'
import SearchProductViewPage, {
  ISearchProductViewPageProps,
} from '@components/ProductViewPage/SearchProductViewPage'

export interface ISearchPageQuery extends ParsedUrlQuery {
  keyword?: string
  sort?: string
  colors?: string | string[]
  fit: string
  season: string
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    await authCheckServerSide(store, context, null)

    const { keyword, sort, colors, fit, season } =
      context.query as ISearchPageQuery

    let body = {}
    if (keyword) {
      body = { keyword }
    }
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
    const products = response.data?.products
    const filterRes = await Axios.post('/api/product/getFilterOptions', body)
    const filterOptions = filterRes.data.filterOptions

    return { props: { products, filterOptions } }
  }
)

interface ISearchPageProps extends ISearchProductViewPageProps {
  keyword: string
}

const search = ({ keyword, products, filterOptions }: ISearchPageProps) => {
  return (
    <>
      <Head>
        <title>Seach | PIIC</title>
        <meta
          name="description"
          content={
            'Nextjs Cloth Shop, PIIC 온라인 의류 판매, ' +
            `PIIC 검색 상품 목록, ${products
              .map((product) => product.name)
              .join(',')}`
          }
        />
        <meta
          name="keywords"
          content={
            'nextjs,shop,website,PIIC,쇼핑,온라인쇼핑, 쇼핑몰, 의류, ' + keyword
          }
        />
      </Head>
      <SearchProductViewPage
        products={products}
        filterOptions={filterOptions}
      />
    </>
  )
}

export default search
