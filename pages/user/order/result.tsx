import Head from 'next/head'
import { authCheckServerSide } from 'hoc/authCheck'
import { wrapper } from '@redux/store'
import OrderResultPage, {
  IOrderResultPageProps,
} from '@components/OrderPage/OrderResultPage'

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const redirect = await authCheckServerSide(store, context, true)
    const { order_id, result } = context.query

    if (redirect !== null || !order_id || !result) {
      return { redirect: { permanent: false, destination: '/' } }
    }

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

export default result
