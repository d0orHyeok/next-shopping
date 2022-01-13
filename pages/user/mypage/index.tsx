import { authCheckServerSide } from 'hoc/authCheck'
import { wrapper } from '@redux/store'
import Head from 'next/head'
import MyPageLayout from '@components/MyPage/MyPageLayout'
import MyPage from '@components/MyPage/pages/MyPage'
import { getPayments } from '@redux/features/paymentSlice'

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const redirect = await authCheckServerSide(store, context, true)

    if (redirect !== null) {
      return { redirect: redirect }
    }

    const user = await store.getState().user
    await store.dispatch(getPayments(user.userData._id))

    return { props: {} }
  }
)

const mypage = () => {
  return (
    <>
      <Head>
        <title>마이페이지 | PIIC</title>
      </Head>
      <MyPageLayout>
        <MyPage />
      </MyPageLayout>
    </>
  )
}

export default mypage
