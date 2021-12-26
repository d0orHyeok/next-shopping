import styles from './Preheader.module.css'
import LoginModal from '@components/utils/LoginModal/LoginModal'
import classnames from 'classnames/bind'
const cx = classnames.bind(styles)
import Link from 'next/link'
import { useState } from 'react'
import { selectUser, userLogout, IUserState } from '@redux/features/userSlice'
import { useAppDispatch, useAppSelector } from '@redux/hooks'

interface PreheaderProps {
  isHome?: boolean
}

const Preheader = ({ isHome }: PreheaderProps) => {
  const dispatch = useAppDispatch()
  const user: IUserState = useAppSelector(selectUser)
  const [open, setOpen] = useState(false)

  const drawList = () =>
    user.isLogin ? (
      <ul>
        <li>{user.userData?.name}님</li>
        <span></span>
        {user.userData?.isAdmin && (
          <>
            <li>
              <div className={styles.loginBtn}>
                <Link href="/admin">관리자</Link>
              </div>
            </li>
            <span></span>
          </>
        )}
        <li>
          <a className={styles.loginBtn} onClick={() => dispatch(userLogout())}>
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
          <a className={styles.loginBtn} onClick={() => setOpen(true)}>
            로그인
          </a>
          <LoginModal open={open} onClose={() => setOpen(false)} />
        </li>
      </ul>
    )

  return (
    <>
      <div className={cx('preheader', isHome && 'isHome')}>{drawList()}</div>
    </>
  )
}

export default Preheader
