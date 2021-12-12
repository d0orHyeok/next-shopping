import Head from 'next/head'
import LandingPage from '@components/LandingPage/LandingPage'
import { authCheckServerSide } from 'hoc/authCheck'
import { wrapper } from '@redux/store'
import { getBestProducts, IBestProduct } from '@redux/features/productSlice'
import Navbar from '@components/Navbar/Navbar'
import Bottom from '@components/Bottom/Bottom'
import { useEffect, useState } from 'react'
import debounce from 'lodash/debounce'

interface HomeProps {
  bestProducts: IBestProduct[]
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    await authCheckServerSide(store, ctx, null)
    await store.dispatch(getBestProducts('all'))

    const bestProducts = await store.getState().product.bestProducts

    return { props: { bestProducts } }
  }
)

// index페이지는 Navbar를 투명하게 설정
// 스크롤을 했을 경우 Navbar에 배경을 다시 보여준다
export const Home = ({ bestProducts }: HomeProps): JSX.Element => {
  // 스크롤 변화를 알기위해 이벤트를 등록한다
  const [scrollY, setScrollY] = useState(0)
  const listener = () => {
    setScrollY(window.pageYOffset)
  }
  const delay = 15
  useEffect(() => {
    window.addEventListener('scroll', debounce(listener, delay))
    return () => window.removeEventListener('scroll', listener)
  })

  // 투명하게 보일지 여부
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    !scrollY ? setIsDark(true) : setIsDark(false)
  }, [scrollY])

  return (
    <>
      <Head>
        <title>Home | PIIC</title>
      </Head>
      <Navbar isHome={true} isDark={isDark} setIsDark={setIsDark} />
      <LandingPage bestProducts={bestProducts} />
      <Bottom />
    </>
  )
}

export default Home
