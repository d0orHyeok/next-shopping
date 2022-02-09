import AuthCheck from 'hoc/authCheck'
import { wrapper } from '@redux/store'
import Head from 'next/head'
import { ParsedUrlQuery } from 'querystring'
import MyPageLayout from '@components/MyPage/MyPageLayout'
import AddrPage from '@components/MyPage/pages/AddrPage'
import ChangeInfoPage from '@components/MyPage/pages/ChangeInfoPage'
import SecessionPage from '@components/MyPage/pages/SecessionPage'
import WishlistPage from '@components/WishlistPage/WishlistPage'

interface IMypageParams extends ParsedUrlQuery {
  page: string
}

const pageList = ['change', 'secession', 'addr', 'wishlist']
const pageName = ['회원정보수정', '회원탈퇴', '배송주소관리', '위시리스트']

export const getServerSideProps = wrapper.getServerSideProps(
  () => async (context) => {
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
    <WishlistPage key={3} />,
  ]

  return (
    <>
      <Head>
        <title>{pageName[index]} | PIIC</title>
      </Head>
      <MyPageLayout title={pageName[index]}>{drawPage[index]}</MyPageLayout>
    </>
  )
}

export default AuthCheck(page, true)
