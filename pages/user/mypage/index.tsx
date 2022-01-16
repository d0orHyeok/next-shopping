import { authCheckServerSide } from 'hoc/authCheck'
import { wrapper } from '@redux/store'
import Head from 'next/head'
import MyPageLayout from '@components/MyPage/MyPageLayout'
import MyPage, { IMyPageIndexProps } from '@components/MyPage/pages/MyPage'
import { IUserState } from '@redux/features/userSlice'
import Axios from 'axios'

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const redirect = await authCheckServerSide(store, context, true)

    if (redirect !== null) {
      return { redirect: redirect }
    }

    const user: IUserState = await store.getState().user

    const response = await Axios.post('/api/payment/getPayments', {
      user_id: user.userData ? user.userData._id : '',
    })

    const payments = response.data.payments ? response.data.payments : []

    return { props: { payments } }
  }
)

const mypage = ({ payments }: IMyPageIndexProps) => {
  return (
    <>
      <Head>
        <title>마이페이지 | PIIC</title>
      </Head>
      <MyPageLayout>
        <MyPage payments={payments} />
      </MyPageLayout>
    </>
  )
}

export default mypage
