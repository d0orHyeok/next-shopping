import { authCheckServerSide } from 'hoc/authCheck'
import { wrapper } from '@redux/store'
import Head from 'next/head'
import MyPageLayout from '@components/MyPage/MyPageLayout'
import MyPage from '@components/MyPage/pages/MyPage'

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const redirect = await authCheckServerSide(store, context, true)

    return redirect ? { redirect: redirect } : { props: {} }
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
