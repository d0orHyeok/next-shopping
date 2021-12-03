import Divider from '@mui/material/Divider'
import React from 'react'
import AuthCheck from 'hoc/authCheck'

// import { wrapper } from '@redux/store'
// import { userAuth } from '@redux/features/userSlice'

// export const getServerSideProps = wrapper.getServerSideProps(
//   (store) => async (ctx) => {
//     console.log('child sssr')
//     return { props: {} }
//   }
// )

const store = () => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '2rem 0',
          height: '90vh',
        }}
      >
        <div style={{ width: '90%' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Store</h1>
          <br />
          <Divider></Divider>
          <br />
          <p>오프라인 매장 준비중...</p>
        </div>
      </div>
    </>
  )
}

export default AuthCheck(store, null)

// you can also use Redux `useSelector` and other hooks instead of `connect()`
// export default connect((state: RootState) => state)(store)
