import OrderPage from '@components/OrderPage/OrderPage'
import Head from 'next/head'
import { authCheckServerSide } from 'hoc/authCheck'
import { wrapper } from '@redux/store'

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const redirect = await authCheckServerSide(
      store,
      context,
      true,
      false,
      '/login'
    )

    return redirect ? { redirect: redirect } : { props: {} }
  }
)

const order = () => {
  return (
    <>
      <Head>
        <title>주문/결제 | PIIC</title>
      </Head>
      <OrderPage />
    </>
  )
}

export default order
