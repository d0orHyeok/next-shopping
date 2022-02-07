import AuthCheck from 'hoc/authCheck'
import Head from 'next/head'
import CartPage from '@components/CartPage/CartPage'
import { authCheckServerSide } from 'hoc/authCheck'
import { wrapper } from '@redux/store'

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const redirect = await authCheckServerSide(store, context, true)

    if (redirect) {
      return { redirect: redirect }
    }

    return { props: {} }
  }
)

const cart = () => {
  return (
    <>
      <Head>
        <title>장바구니 | PIIC</title>
      </Head>
      <CartPage />
    </>
  )
}

export default AuthCheck(cart, null)
