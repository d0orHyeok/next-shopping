import LoginPage from '@components/LoginPage/LoginPage'
import { authCheckServerSide } from 'hoc/authCheck'
import { wrapper } from '@redux/store'
import Head from 'next/head'

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const redirect = await authCheckServerSide(store, context, false)

    return redirect ? { redirect: redirect, props: {} } : { props: {} }
  }
)

const login = () => {
  return (
    <>
      <Head>
        <title>로그인 | PIIC</title>
      </Head>
      <LoginPage />
    </>
  )
}

export default login
