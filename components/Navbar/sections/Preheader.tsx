import styles from './Preheader.module.css'
import LoginModal from '@components/utils/LoginModal/LoginModal'

import Link from 'next/link'
import { useState } from 'react'
import { selectUser } from '@redux/features/userSlice'
import { useAppSelector } from '@redux/hooks'

const Preheader = () => {
  const user = useAppSelector(selectUser)

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const drawList = (isLogin: boolean) =>
    isLogin ? (
      <ul>
        <li>환영합니다.</li>
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
      <div className={styles.preheader}>{drawList(user.isLogin)}</div>
    </>
  )
}

export default Preheader
