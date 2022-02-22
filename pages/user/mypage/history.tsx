import { authCheckServerSide } from 'hoc/authCheck'
import { wrapper } from '@redux/store'
import Head from 'next/head'
import MyPageLayout from '@components/MyPage/MyPageLayout'
import HistoryPage, {
  IHistoryPageProps,
} from '@components/MyPage/pages/HistoryPage'
import { ParsedUrlQuery } from 'querystring'
import dayjs from 'dayjs'
import Axios from 'axios'
import { IPayment } from '@models/Payment'
import { useEffect, useState } from 'react'

interface IHistoryPageQuery extends ParsedUrlQuery {
  mode?: 'order' | 'refund'
  order_state?: string
  date_start?: string
  date_end?: string
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const redirect = await authCheckServerSide(store, context, true)
    if (redirect) {
      return { redirect }
    }

    const today = dayjs(Date.now())

    const { mode, order_state, date_start, date_end } =
      context.query as IHistoryPageQuery

    const data = {
      mode: mode ? mode : 'order',
      order_state: order_state ? order_state : '',
      date_start: date_start
        ? date_start
        : today.subtract(3, 'month').format('YYYY-MM-DD'),
      date_end: date_end ? date_end : today.format('YYYY-MM-DD'),
    }

    return {
      props: { ...data },
    }
  }
)

const history = (props: IHistoryPageProps) => {
  const [payments, setPayments] = useState<IPayment[]>([])

  const { mode, order_state, date_start, date_end } = props

  useEffect(() => {
    Axios.post('/api/payment/getPayments', props).then((res) =>
      setPayments(res.data.payments ? res.data.payments : [])
    )
  }, [props])

  return (
    <>
      <Head>
        <title>주문조회 | PIIC</title>
      </Head>
      <MyPageLayout title={'주문조회'} contentTitleUnderline={false}>
        <HistoryPage
          payments={payments}
          mode={mode}
          order_state={order_state}
          date_start={date_start}
          date_end={date_end}
        />
      </MyPageLayout>
    </>
  )
}

export default history
