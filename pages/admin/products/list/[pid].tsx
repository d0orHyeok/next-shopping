import AddProductPage from '@components/AddProductPage/AddProductPage'
import { authCheckServerSide } from 'hoc/authCheck'
import { wrapper } from '@redux/store'
import Axios from 'axios'
import { ParsedUrlQuery } from 'querystring'
import { IProduct } from '@models/Product'

interface IEditProductPageProps {
  product: IProduct
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const redirect = await authCheckServerSide(store, context, true, true)

    const { pid } = context.params as ParsedUrlQuery
    const response = await Axios.post('/api/product/getProductDetail', { pid })
    const product = response.data.productDetail.product

    return redirect ? { redirect: redirect, props: {} } : { props: { product } }
  }
)

const ProductEditPage = ({ product }: IEditProductPageProps) => {
  return (
    <>
      <AddProductPage product={product} />
    </>
  )
}

export default ProductEditPage
