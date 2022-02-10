import AuthCheck from 'hoc/authCheck'
import Head from 'next/head'
import MyPageLayout from '@components/MyPage/MyPageLayout'
import MyPage from '@components/MyPage/pages/MyPage'
import { useEffect, useState } from 'react'
import { IPayment } from '@models/Payment'
import Axios from 'axios'

const mypage = () => {
  const [payments, setPayments] = useState<IPayment[]>([])

  useEffect(() => {
    Axios.post('/api/payment/getPayments')
      .then((res) => setPayments(res.data.payments ? res.data.payments : []))
      .catch((err) => console.log(err.responese))
  }, [])

  return (
    <>
      <Head>
        <title>마이페이지 | PIIC</title>
      </Head>
      <MyPageLayout contentTitleUnderline={false}>
        <MyPage payments={payments} />
      </MyPageLayout>
    </>
  )
}

export default AuthCheck(mypage, true)
