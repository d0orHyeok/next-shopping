import Head from 'next/head'
import LandingPage from '@components/LandingPage/LandingPage'
import AuthCheck from 'hoc/authCheck'
import { wrapper } from '@redux/store'
import { getBestProducts, IBestProduct } from '@redux/features/productSlice'
import Navbar from '@components/Navbar/Navbar'
import Bottom from '@components/Bottom/Bottom'
import { useEffect, useState } from 'react'
import debounce from 'lodash/debounce'
import { IProduct } from '@models/Product'
import Axios from 'axios'

interface HomeProps {
  bestProducts: IProduct[]
  newProducts: IProduct[]
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async () => {
    await store.dispatch(getBestProducts())

    const bestProducts = await store
      .getState()
      .product.bestProducts.filter(
        (item: IBestProduct) => item.mainCategory === 'best'
      )[0].products

    const response = await Axios.get('/api/product/getNewProducts')
    const newProducts = response.data.newProducts

    return { props: { bestProducts, newProducts } }
  }
)

// index페이지는 Navbar를 투명하게 설정
// 스크롤을 했을 경우 Navbar에 배경을 다시 보여준다
export const Home = ({ bestProducts, newProducts }: HomeProps): JSX.Element => {
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

  return (
    <>
      <Head>
        <title>Home | PIIC</title>
      </Head>
      <Navbar
        isHome={!scrollY}
        isDark={!scrollY ? isDark : false}
        setIsDark={setIsDark}
      />
      <LandingPage bestProducts={bestProducts} newProducts={newProducts} />
      <Bottom />
    </>
  )
}

export default AuthCheck(Home, null)
