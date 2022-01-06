import { authCheckServerSide } from 'hoc/authCheck'
import { wrapper } from '@redux/store'
import Head from 'next/head'

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const redirect = await authCheckServerSide(store, context, true)

    return redirect ? { redirect: redirect, props: {} } : { props: {} }
  }
)

const MyPage = () => {
  return (
    <>
      <Head>
        <title>마이페이지 | PIIC</title>
      </Head>
      <div>MyPage</div>
    </>
  )
}

export default MyPage
