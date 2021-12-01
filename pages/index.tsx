import Head from 'next/head'
import { useAppDispatch } from '@redux/hooks'
import { userAuth, userLogout } from '@redux/features/userSlice'

export const Home = (): JSX.Element => {
  const dispatch = useAppDispatch()

  const logout = () => {
    dispatch(userLogout()).then((res) => console.log(res))
  }

  const test = () => {
    dispatch(userAuth())
  }

  return (
    <>
      <Head>
        <title>Home | Shopping</title>
      </Head>

      <main style={{ height: '100vh' }}>
        <h1 className="title">
          <button onClick={logout}>로그아웃 테스트</button>
          <button onClick={test}>redux test</button>
        </h1>
      </main>
    </>
  )
}

export default Home
