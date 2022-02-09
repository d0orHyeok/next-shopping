import type { AppProps } from 'next/app'
import Head from 'next/head'
import Layout from '@components/Layout'
import { wrapper } from '@redux/store'
import '@styles/global.css'
import '@styles/variable.css'
import { useRouter } from 'next/router'
import { SessionProvider } from 'next-auth/react'
import SideBar from '@components/utils/SideBar/SideBar'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const pathname = useRouter().pathname

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="author" content="JangHyeok Kim" />
        <meta
          name="description"
          content="Nextjs Cloth Shop, PIIC 온라인 의류 판매"
        />
        <meta
          name="keywords"
          content="nextjs,shop,website,PIIC,쇼핑,온라인쇼핑, 쇼핑몰, 의류"
        />
      </Head>
      <SessionProvider session={pageProps.session}>
        {pathname === '/' || pathname === '/user/order' ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
        {pathname !== '/user/order' && <SideBar />}
      </SessionProvider>
    </>
  )
}

export default wrapper.withRedux(MyApp)
