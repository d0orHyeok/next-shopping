import AuthCheck from 'hoc/authCheck'
import Head from 'next/head'

const wishlist = () => {
  return (
    <>
      <Head>
        <title>위시리스트 | PIIC</title>
      </Head>
      <div>WishListPage</div>
    </>
  )
}

export default AuthCheck(wishlist, null)
