import RegisterPage from '@components/RegisterPage/RegisterPage'
import AuthCheck from 'hoc/authCheck'
import Head from 'next/head'

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

export default AuthCheck(register, false)
