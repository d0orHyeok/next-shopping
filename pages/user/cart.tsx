import AuthCheck from 'hoc/authCheck'
import Head from 'next/head'
import CartPage from '@components/CartPage/CartPage'

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

export default AuthCheck(cart, true)
