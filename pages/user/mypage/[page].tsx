import { authCheckServerSide } from 'hoc/authCheck'
import { wrapper } from '@redux/store'
import Head from 'next/head'
import { ParsedUrlQuery } from 'querystring'
import MyPageLayout from '@components/MyPage/MyPageLayout'
import AddrPage from '@components/MyPage/pages/AddrPage'
import ChangeInfoPage from '@components/MyPage/pages/ChangeInfoPage'
import OrderCancelPage from '@components/MyPage/pages/OrderCancelPage'
import OrderCheckPage from '@components/MyPage/pages/OrderCheckPage'
import SecessionPage from '@components/MyPage/pages/SecessionPage'
import WishlistPage from '@components/WishlistPage/WishlistPage'

interface IMypageParams extends ParsedUrlQuery {
  page: string
}

const pageList = ['change', 'secession', 'addr', 'orders', 'cancel', 'wishlist']
const pageName = [
  '회원정보수정',
  '회원탈퇴',
  '배송주소관리',
  '주문/배송',
  '취소/반품',
  '위시리스트',
]

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (context) => {
    const redirect = await authCheckServerSide(store, context, true)

    if (redirect) {
      return { redirect: redirect }
    }

    const { page } = context.params as IMypageParams

    if (!pageList.includes(page)) {
      return { redirect: { permanent: false, destination: '/404' } }
    }

    return { props: { page } }
  }
)

const page = ({ page }: IMypageParams) => {
  const index = pageList.findIndex((item) => item === page)
  const drawPage = [
    <ChangeInfoPage key={0} />,
    <SecessionPage key={1} />,
    <AddrPage key={2} />,
    <OrderCheckPage key={3} />,
    <OrderCancelPage key={4} />,
    <WishlistPage key={5} />,
  ]

  return (
    <>
      <Head>
        <title>{pageName[index]} | PIIC</title>
      </Head>
      <MyPageLayout
        title={pageName[index]}
        contentStyle={index === 2 ? { minWidth: '655px' } : {}}
      >
        {drawPage[index]}
      </MyPageLayout>
    </>
  )
}

export default page
