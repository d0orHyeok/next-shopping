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

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    await authCheckServerSide(store, ctx, null)

    const { mainCategory, subCategory } = ctx.params as SubCategoryPageParams

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

    let products: IProduct[] = []
    let category: string[] = []

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
      category =
        subCategory === 'all' ? [mainCategory] : [mainCategory, subCategory]
      const response = await Axios.post('/api/product/findProducts', {
        category,
      })
      products = response.data?.products
    }

    return { props: { products, category } }
  }
)

type SubCategoryPageProps = IProductViewPageProps

const SubCategory = ({ products, category }: SubCategoryPageProps) => {
  return (
    <>
      <Head>
        <title>{category[category.length - 1].toUpperCase()} | PIIC</title>
      </Head>
      <ProductViewPage products={products} category={category} />
    </>
  )
}

export default SubCategory
