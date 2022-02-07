import styles from './Preheader.module.css'
import LoginModal from '@components/utils/LoginModal/LoginModal'
import classnames from 'classnames/bind'
const cx = classnames.bind(styles)
import Link from 'next/link'
import { useState } from 'react'
import { selectUser, IUserState, userLogout } from '@redux/features/userSlice'
import { useAppSelector, useAppDispatch } from '@redux/hooks'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'

interface PreheaderProps {
  isHome?: boolean
}

const Preheader = ({ isHome }: PreheaderProps) => {
  const router = useRouter()
  const user: IUserState = useAppSelector(selectUser)
  const dispatch = useAppDispatch()

  const [open, setOpen] = useState(false)

  const { data: session } = useSession()

  const logout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      dispatch(userLogout())
      signOut({ redirect: false })
      router.push('/')
    }
  }

  const drawList = () =>
    session ? (
      <ul>
        <li>{user.userData?.name}님</li>
        <span></span>
        {user.userData?.isAdmin ? (
          <>
            <li>
              <div className={styles.loginBtn}>
                <Link href="/admin">관리자</Link>
              </div>
            </li>
            <span></span>
          </>
        ) : (
          <>
            <li>
              <div className={styles.loginBtn}>
                <Link href="/user/mypage">마이페이지</Link>
              </div>
            </li>
            <span></span>
          </>
        )}
        <li>
          <a className={styles.loginBtn} onClick={() => logout()}>
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
