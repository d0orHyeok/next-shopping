import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'

import styles from './DrawPage.module.css'
import classnames from 'classnames/bind'
const cx = classnames.bind(styles)

import Link from 'next/link'

interface DrawPageProps {
  refreshFunction: React.Dispatch<React.SetStateAction<boolean>>
}

const DrawPage = ({ refreshFunction }: DrawPageProps) => {
  const toggleDrawer = (e: React.MouseEvent): void => {
    console.log(e.type)
    refreshFunction(false)
  }

  return (
    <>
      <div className={cx('wrapper')}>
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
              <button
                onClick={toggleDrawer}
                className={cx('registerBtn', 'userBtn')}
              >
                회원가입
              </button>
            </Link>
            <Link href="/login">
              <button className={cx('loginBtn', 'userBtn')}>로그인</button>
            </Link>
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
