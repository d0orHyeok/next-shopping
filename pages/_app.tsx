import type { AppProps } from 'next/app'
import Head from 'next/head'
import Layout from '@components/Layout'
import { wrapper } from '@redux/store'
import '@styles/global.css'
import '@styles/variable.css'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const pathname = useRouter().pathname

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Shopping" />
        <meta name="keywords" content="nextjs,static,website" />
      </Head>
      {pathname === '/' ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </>
  )
}

export default wrapper.withRedux(MyApp)
