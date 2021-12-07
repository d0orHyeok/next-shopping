import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import LoginModal from '@components/utils/LoginModal/LoginModal'

import styles from './SideNavBox.module.css'
import classnames from 'classnames/bind'
const cx = classnames.bind(styles)

import Link from 'next/link'
import { useState } from 'react'
import { selectUser, userLogout } from '@redux/features/userSlice'
import { useAppSelector, useAppDispatch } from '@redux/hooks'

interface DrawPageProops {
  onClose?: (open: boolean) => void
}

const DrawPage = ({ onClose }: DrawPageProops) => {
  const dispatch = useAppDispatch()

  const user = useAppSelector(selectUser)

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleLogout = () => {
    dispatch(userLogout())
  }

  const drawLoginBox = () =>
    !user.isLogin ? (
      <>
        <p className={cx('user-desc')}>
          환영합니다! PIIC에 가입하여 다양한 상품들을 둘러보세요
        </p>
        <div className={cx('userBtn-wrapper')}>
          <Link href="/register">
            <button className={cx('registerBtn', 'userBtn')}>회원가입</button>
          </Link>
          <button onClick={handleOpen} className={cx('loginBtn', 'userBtn')}>
            로그인
          </button>
          <LoginModal open={open} onClose={handleClose} />
        </div>
      </>
    ) : (
      <>
        <p className={cx('user-desc')}>{user.userData?.name}님 환영합니다.</p>
        <div className={cx('userBtn-wrapper')}>
          <button
            onClick={() => {
              handleLogout()
              onClose && onClose(false)
            }}
            className={cx('userBtn', 'registerBtn')}
          >
            로그아웃
          </button>
          {user.userData?.isAdmin && (
            <Link href="/admin">
              <button className={cx('loginBtn', 'userBtn')}>관리자</button>
            </Link>
          )}
        </div>
      </>
    )

  return (
    <>
      <div className={cx('wrapper')}>
        <IconButton
          className={styles.closeBtn}
          type="button"
          color="inherit"
          sx={{ p: '5px' }}
          onClick={() => onClose && onClose(false)}
        >
          <CloseIcon />
        </IconButton>
        <nav className={cx('menu')}>
          <ul>
            <li>Best</li>
            <li>Men</li>
            <li>Women</li>
          </ul>
        </nav>
        <div className={cx('user')}>{drawLoginBox()}</div>
        <ul className={cx('member')}>
          <li>
            <Link href="/user/cart">
              <div className={cx('memberBtn')}>
                <ShoppingBagOutlinedIcon fontSize="large" />
                <span>장바구니</span>
              </div>
            </Link>
          </li>
          <li>
            <Link href="/user/wishlist">
              <div className={cx('memberBtn')}>
                <FavoriteBorderOutlinedIcon fontSize="large" />
                <span>위시리스트</span>
              </div>
            </Link>
          </li>
        </ul>
      </div>
    </>
  )
}

export default DrawPage
