import AuthCheck from 'hoc/authCheck'
import Head from 'next/head'

export const Home = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>Home | PIIC</title>
      </Head>

      <div>main</div>
    </>
  )
}

export default AuthCheck(Home, null)
