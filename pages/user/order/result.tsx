import Head from 'next/head'
import AuthCheck from 'hoc/authCheck'

import { wrapper } from '@redux/store'
import OrderResultPage, {
  IOrderResultPageProps,
} from '@components/OrderPage/OrderResultPage'

export const getServerSideProps = wrapper.getServerSideProps(
  () => async (context) => {
    const { order_id, result } = context.query

    return { props: { order_id, result } }
  }
)

const result = ({ order_id, result }: IOrderResultPageProps) => {
  return (
    <>
      <Head>
        <title>주문결과 | PIIC</title>
      </Head>
      <OrderResultPage order_id={order_id} result={result} />
    </>
  )
}

export default AuthCheck(result, true)
