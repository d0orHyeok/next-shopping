import OrderPage from '@components/OrderPage/OrderPage'
import Head from 'next/head'
import AuthCheck from 'hoc/authCheck'

const order = () => {
  return (
    <>
      <Head>
        <title>주문/결제 | PIIC</title>
        <script
          src="https://cdn.bootpay.co.kr/js/bootpay-3.3.1.min.js"
          type="application/javascript"
        ></script>
      </Head>
      <OrderPage />
    </>
  )
}

export default AuthCheck(order, true)
