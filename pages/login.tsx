import LoginPage from '@components/LoginPage/LoginPage'
import AuthCheck from 'hoc/authCheck'
import Head from 'next/head'

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

export default AuthCheck(login, false)
