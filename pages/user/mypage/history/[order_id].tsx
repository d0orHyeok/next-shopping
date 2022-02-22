import { authCheckServerSide } from 'hoc/authCheck'
import { wrapper } from '@redux/store'
import Head from 'next/head'
import { ParsedUrlQuery } from 'querystring'
import Axios from 'axios'
import { IPayment } from '@models/Payment'
import MyPageLayout from '@components/MyPage/MyPageLayout'
import HistoryDetailPage from '@components/MyPage/pages/HistoryDetailPage'

interface IHistoryOrderDetailParams extends ParsedUrlQuery {
  order_id: string
}

interface IHistoryOrderDetailProps {
  payment: IPayment
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const redirect = await authCheckServerSide(store, context, true)
    if (redirect) {
      return { redirect }
    }

    const { order_id } = context.params as IHistoryOrderDetailParams
    const response = await Axios.post('/api/payment/getPaymentByOrderID', {
      order_id,
    })
    const payment = response.data.payment

    return { props: { payment } }
  }
)

const HistoryOrderDetail = ({ payment }: IHistoryOrderDetailProps) => {
  return (
    <>
      <Head>
        <title>주문상세조회 | PIIC</title>
        <meta
          name="description"
          content={
            'Nextjs Cloth Shop, PIIC 온라인 의류 판매, ' + `PIIC 주문상세조회,`
          }
        />
        <meta
          name="keywords"
          content={'nextjs,shop,website,PIIC,쇼핑,온라인쇼핑, 쇼핑몰, 의류, '}
        />
      </Head>
      <MyPageLayout title="주문상세조회" contentTitleUnderline={false}>
        <HistoryDetailPage payment={payment} />
      </MyPageLayout>
    </>
  )
}

export default HistoryOrderDetail
