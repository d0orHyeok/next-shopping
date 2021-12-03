import styles from './Preheader.module.css'
import LoginModal from '@components/utils/LoginModal/LoginModal'

import Link from 'next/link'
import { useState } from 'react'
import { selectUser, userLogout } from '@redux/features/userSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'

const Preheader = () => {
  const dispatch = useAppDispatch()

  const user = useAppSelector(selectUser)

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleLogout = () => {
    dispatch(userLogout())
  }

  const drawList = () =>
    user.isLogin ? (
      <ul>
        <li>{user.userData?.name}</li>
        <span></span>
        <li>
          <a className={styles.loginBtn} onClick={handleLogout}>
            로그아웃
          </a>
        </li>
      </ul>
    ) : (
      <ul>
        <li>
          <Link href="/register">회원가입</Link>
        </li>
        <span></span>
        <li>
          {/* <Link href="/login">로그인</Link> */}
          <a className={styles.loginBtn} onClick={handleOpen}>
            로그인
          </a>
          <LoginModal open={open} onClose={handleClose} />
        </li>
      </ul>
    )

  return (
    <>
      <div className={styles.preheader}>{drawList()}</div>
    </>
  )
}

export default Preheader
