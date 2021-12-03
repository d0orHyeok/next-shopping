import AuthCheck from 'hoc/authCheck'
import Head from 'next/head'

export const Home = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>Home | Shopping</title>
      </Head>

      <main style={{ height: '100vh' }}></main>
    </>
  )
}

export default AuthCheck(Home, null)
