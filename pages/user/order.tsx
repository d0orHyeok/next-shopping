import OrderPage from '@components/OrderPage/OrderPage'
import Head from 'next/head'
import AuthCheck from 'hoc/authCheck'

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

export default AuthCheck(order, null)
