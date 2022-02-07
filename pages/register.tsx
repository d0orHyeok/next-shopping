import RegisterPage from '@components/RegisterPage/RegisterPage'
import { authCheckServerSide } from 'hoc/authCheck'
import { wrapper } from '@redux/store'
import Head from 'next/head'

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const redirect = await authCheckServerSide(store, context, false)

    if (redirect) {
      return { redirect: redirect }
    }

    return { props: {} }
  }
)

const register = () => {
  return (
    <>
      <Head>
        <title>회원가입 | PIIC</title>
      </Head>
      <RegisterPage />
    </>
  )
}

export default register
