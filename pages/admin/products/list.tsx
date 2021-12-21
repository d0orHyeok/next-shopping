import { authCheckServerSide } from 'hoc/authCheck'
import { wrapper } from '@redux/store'
import Axios from 'axios'
import { IProduct } from '@models/Product'
import AdminProductListPage from '@components/AdminProductListPage/AdminProductListPage'

export interface IListPageProps {
  products: IProduct[]
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    await authCheckServerSide(store, context, false)

    const response = await Axios.get('/api/product/getProducts')
    const products = response.data.products

    return { props: { products } }
  }
)

const ListPage = ({ products }: IListPageProps) => {
  return (
    <>
      <AdminProductListPage products={products} />
    </>
  )
}

export default ListPage
