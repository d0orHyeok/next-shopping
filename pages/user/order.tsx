import OrderPage from '@components/OrderPage/OrderPage'
import Head from 'next/head'

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
