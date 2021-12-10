import AuthCheck from 'hoc/authCheck'
import Head from 'next/head'

const cart = () => {
  return (
    <>
      <Head>
        <title>장바구니 | PIIC</title>
      </Head>
      <div>CartPage</div>
    </>
  )
}

export default AuthCheck(cart, true)
