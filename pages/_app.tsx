// import App from "next/app";
import type { AppProps /*, AppContext */ } from 'next/app'
import Head from 'next/head'
import Layout from '@components/Layout'
import { wrapper } from '@redux/store'
// import { userAuth } from '@redux/features/userSlice'
// import App from 'next/app'
// import cookies from 'next-cookies'

import '@styles/global.css'
import '@styles/variable.css'

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Shopping" />
        <meta name="keywords" content="nextjs,static,website" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  )
}

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext: AppContext) => {
//   // calls page's `getInitialProps` and fills `a ppProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps }
// }

// MyApp.getInitialProps = wrapper.getInitialAppProps(
//   (store) => async (context) => {
//     const { ctx } = context
//     const { w_auth } = cookies(ctx)
//     if (w_auth) {
//       await store.dispatch(userAuth({ token: w_auth }))
//     }

//     const appProps = await App.getInitialProps(context)

//     return appProps
//   }
// )

export default wrapper.withRedux(MyApp)
