import ProductDetailPage from '@components/ProductDetailPage/ProductDetailPage'
import { authCheckServerSide } from 'hoc/authCheck'
import { wrapper } from '@redux/store'
import Head from 'next/head'
import { ParsedUrlQuery } from 'querystring'
import Axios from 'axios'
import { IProductDetail } from '@api/product/getProductDetail'

export interface IDetailPageProps {
  productDetail: IProductDetail
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    await authCheckServerSide(store, context, false)

    const { pid } = context.params as ParsedUrlQuery
    const response = await Axios.post('/api/product/getProductDetail', { pid })
    const productDetail = response.data.productDetail

    return { props: { productDetail } }
  }
)

const DetailPage = ({ productDetail }: IDetailPageProps) => {
  return (
    <>
      <Head>
        <title>ProductName | PIIC</title>
        <meta
          name="description"
          content={
            'Nextjs Cloth Shop, PIIC 온라인 의류 판매, ' + `PIIC 상품 설명,`
          }
        />
        <meta
          name="keywords"
          content={'nextjs,shop,website,PIIC,쇼핑,온라인쇼핑, 쇼핑몰, 의류, '}
        />
      </Head>
      <ProductDetailPage productDetail={productDetail} />
    </>
  )
}

export default DetailPage
