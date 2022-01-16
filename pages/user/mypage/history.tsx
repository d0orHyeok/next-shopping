import { authCheckServerSide } from 'hoc/authCheck'
import { wrapper } from '@redux/store'
import Head from 'next/head'
import MyPageLayout from '@components/MyPage/MyPageLayout'
import { getPayments } from '@redux/features/paymentSlice'
import HistoryPage, {
  IHistoryPageProps,
} from '@components/MyPage/pages/HistoryPage'
import { ParsedUrlQuery } from 'querystring'

interface IHistoryPageQuery extends ParsedUrlQuery {
  mode?: 'all' | 'refund'
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const redirect = await authCheckServerSide(store, context, true)

    if (redirect !== null) {
      return { redirect: redirect }
    }

    const user = await store.getState().user
    await store.dispatch(getPayments(user.userData._id))

    const { mode } = context.query as IHistoryPageQuery

    return {
      props: { mode: mode ? mode : 'all' },
    }
  }
)

const history = ({ mode }: IHistoryPageProps) => {
  return (
    <>
      <Head>
        <title>마이페이지 | PIIC</title>
      </Head>
      <MyPageLayout title={'주문조회'} contentTitleUnderline={false}>
        <HistoryPage mode={mode} />
      </MyPageLayout>
    </>
  )
}

export default history
