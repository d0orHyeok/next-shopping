import AuthCheck from 'hoc/authCheck'
import Head from 'next/head'
import WishlistPage from '@components/WishlistPage/WishlistPage'

const wishlist = () => {
  return (
    <>
      <Head>
        <title>위시리스트 | PIIC</title>
      </Head>
      <WishlistPage />
    </>
  )
}

export default AuthCheck(wishlist, null)
