import Head from 'next/head'

export const Home = (): JSX.Element => {
  return (
    <>
      <Head>
        <title>Home | Shopping</title>
      </Head>

      <main style={{ height: '100vh' }}>
        <h1 className="title">
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
      </main>
    </>
  )
}

export default Home
