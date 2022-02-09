import ProductViewPage, {
  IProductViewPageProps,
} from '@components/ProductViewPage/ProductViewPage'
import AuthCheck from 'hoc/authCheck'
import { wrapper } from '@redux/store'
import { ParsedUrlQuery } from 'querystring'
import { IProduct } from '@models/Product'
import Axios from 'axios'
import Head from 'next/head'
import * as getCategory from '@libs/getCategory'

export interface ISubCategoryPageQuery extends ParsedUrlQuery {
  mainCategory: string
  subCategory: string
  itemCategory?: string
  sort?: string
  colors?: string | string[]
  fit: string
  season: string
}

export const getServerSideProps = wrapper.getServerSideProps(
  () => async (context) => {
    const {
      mainCategory,
      subCategory,
      itemCategory,
      sort,
      colors,
      fit,
      season,
    } = context.query as ISubCategoryPageQuery

    // 잘못된 링크 접속일 경우 404페이지로 Redirect
    if (
      ['best', ...getCategory.getMainCategorys()].filter(
        (item) => item === mainCategory
      ).length === 0
    ) {
      return {
        redirect: {
          permanent: false,
          destination: `/404`,
        },
      }
    }
    if (
      ['all', 'best', ...getCategory.getSubCateogrys(mainCategory)].filter(
        (item) => item === subCategory
      ).length === 0
    ) {
      return {
        redirect: {
          permanent: false,
          destination: `/404`,
        },
      }
    }

    const category =
      mainCategory === 'best' || subCategory === 'all'
        ? [mainCategory]
        : [mainCategory, subCategory] // 서버에 요청할 카테고리 목록
    let products: IProduct[] = [] // props로 전달할 상품 목록
    let filterOptions = {}

    let body = {}
    body = { category }
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

    if (mainCategory === 'best' || subCategory === 'best') {
      const response = await Axios.post('/api/product/findBestProducts', body)
      products = response.data?.products
      filterOptions = response.data.filterOptions
    } else {
      if (itemCategory !== undefined) {
        // query로 마지막 카테고리 목록을 요청하는 경우
        category.push(itemCategory.toString())
      }

      const response = await Axios.post('/api/product/findProducts', body)
      products = response.data?.products
      const filterRes = await Axios.post('/api/product/getFilterOptions', body)
      filterOptions = filterRes.data.filterOptions
    }

    return { props: { products, category, filterOptions } }
  }
)

interface SubCategoryPageProps extends IProductViewPageProps {
  category: string[]
}

const SubCategory = ({
  products,
  category,
  filterOptions,
}: SubCategoryPageProps) => {
  const metaDesc = products.map((product) => product.name).join(',')

  return (
    <>
      <Head>
        <title>{category[category.length - 1].toUpperCase()} | PIIC</title>
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
            'nextjs,shop,website,PIIC,쇼핑,온라인쇼핑, 쇼핑몰, 의류, ' +
            category.join(',')
          }
        />
      </Head>
      <ProductViewPage products={products} filterOptions={filterOptions} />
    </>
  )
}

export default AuthCheck(SubCategory, null)
