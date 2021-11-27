import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Modal from '@mui/material/Modal'

import styles from './SideNavBox.module.css'
import classnames from 'classnames/bind'
const cx = classnames.bind(styles)

import Link from 'next/link'
import { useState } from 'react'
import LoginBox from '@components/LoginBox/LoginBox'

interface DrawPageProops {
  onClose?: (open: boolean) => void
}

const DrawPage = ({ onClose }: DrawPageProops) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

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
        <div className={cx('user')}>
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
            <Modal open={open} onClose={handleClose}>
              <LoginBox onClose={handleClose} />
            </Modal>
          </div>
        </div>
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
