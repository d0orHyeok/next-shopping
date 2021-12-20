import ProductViewPage, {
  IProductViewPageProps,
} from '@components/ProductViewPage/ProductViewPage'
import { authCheckServerSide } from 'hoc/authCheck'
import { wrapper } from '@redux/store'
import { ParsedUrlQuery } from 'querystring'
import { getBestProducts, IBestProduct } from '@redux/features/productSlice'
import { IProduct } from '@models/Product'
import Axios from 'axios'
import Head from 'next/head'
import * as getCategory from '@libs/getCategory'

interface SubCategoryPageParams extends ParsedUrlQuery {
  mainCategory: string
  subCategory: string
}

interface SubCategoryPageQuery extends ParsedUrlQuery {
  itemCategory?: string
  sort?: string
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    // 로그인 여부 확인
    await authCheckServerSide(store, context, null)

    const { itemCategory, sort } = context.query as SubCategoryPageQuery
    const { mainCategory, subCategory } =
      context.params as SubCategoryPageParams

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

    let category: string[] = [] // 서버에 요청할 카테고리 목록
    let products: IProduct[] = [] // props로 전달할 상품 목록
    let body = {}
    if (sort !== undefined) {
      const sortOption = sort.split('_')
      body = { sort: { [sortOption[0]]: sortOption[1] === 'asc' ? 1 : -1 } }
    }

    // best 상품조회할 경우 redux state 사용
    if (mainCategory === 'best' || subCategory === 'best') {
      // check state
      let bestProducts: IBestProduct[] = await store.getState().product
        .bestProducts
      if (bestProducts.length === 0) {
        // if state is empty, dispatch
        await store.dispatch(getBestProducts())
        bestProducts = await store.getState().product.bestProducts
      }

      products = bestProducts.filter(
        (item) => item.mainCategory === mainCategory
      )[0].products

      category =
        mainCategory === 'best' ? [mainCategory] : [mainCategory, subCategory]
    } else {
      // 전체상품 조회 하는지에 따라 category 설정
      category =
        subCategory === 'all' ? [mainCategory] : [mainCategory, subCategory]
      if (itemCategory !== undefined) {
        // query로 마지막 카테고리 목록을 요청하는 경우
        category.push(itemCategory.toString())
      }

      body = { ...body, category }
      const response = await Axios.post('/api/product/findProducts', body)
      products = response.data?.products
    }

    return { props: { products, category } }
  }
)

type SubCategoryPageProps = IProductViewPageProps

const SubCategory = ({ products, category }: SubCategoryPageProps) => {
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
      <ProductViewPage products={products} category={category} />
    </>
  )
}

export default SubCategory
