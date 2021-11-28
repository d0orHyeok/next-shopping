import Head from 'next/head'
import Axios from 'axios'

export const Home = (): JSX.Element => {
  const logout = () => {
    Axios.get('/api/users/logout')
      .then((res) => {
        alert(res.data.message)
      })
      .catch((error) => {
        !error.response.data
          ? alert('실패하였습니다.')
          : alert(error.response.data.message)
      })
  }

  return (
    <>
      <Head>
        <title>Home | Shopping</title>
      </Head>

      <main style={{ height: '100vh' }}>
        <h1 className="title">
          <button onClick={logout}>로그아웃 테스트</button>
        </h1>
      </main>
    </>
  )
}

export default Home
