import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import LoginModal from '@components/utils/LoginModal/LoginModal'
import { useSession, signOut } from 'next-auth/react'
import styles from './SideNavBox.module.css'
import classnames from 'classnames/bind'
const cx = classnames.bind(styles)
import Link from 'next/link'
import React, { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import * as getCategory from '@libs/getCategory'
import { useRouter } from 'next/router'
import { IUserState, selectUser, userLogout } from '@redux/features/userSlice'

const navCategory = ['best', ...getCategory.getMainCategorys()]

interface DrawPageProops {
  onClose: (open: boolean) => void
}

const DrawPage = ({ onClose }: DrawPageProops) => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const user: IUserState = useAppSelector(selectUser)

  const [open, setOpen] = useState(false)
  const [toggleSubMenu, settoggleSubMenu] = useState(false)
  const [menuItem, setMenuItem] = useState('')
  const [subMenuItems, setSubMenuItems] = useState<string[]>([])

  const { data: session } = useSession()

  const logout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      dispatch(userLogout())
      signOut({ redirect: false })
      router.push('/')
    }
  }

  const handleOpenSubMenu = (mainCategory: string) => {
    setMenuItem(mainCategory)
    if (mainCategory !== 'best') {
      const newSubMenuItems = getCategory.getSubCateogrys(mainCategory)
      setSubMenuItems(newSubMenuItems)
    }
    settoggleSubMenu(true)
  }

  const drawLoginBox = () =>
    !session ? (
      <>
        <p className={cx('user-desc')}>
          환영합니다! PIIC에 가입하여 다양한 상품들을 둘러보세요
        </p>
        <div className={cx('userBtn-wrapper')}>
          <Link href="/register">
            <button className={cx('registerBtn', 'userBtn')}>회원가입</button>
          </Link>
          <button
            onClick={() => setOpen(true)}
            className={cx('loginBtn', 'userBtn')}
          >
            로그인
          </button>
          <LoginModal open={open} onClose={() => setOpen(false)} />
        </div>
      </>
    ) : (
      <>
        <p className={cx('user-desc')}>{session.userData.name}님 환영합니다.</p>
        <div className={cx('userBtn-wrapper')}>
          <button onClick={logout} className={cx('userBtn', 'registerBtn')}>
            로그아웃
          </button>

          {user.userData?.isAdmin ? (
            <Link href="/admin">
              <button className={cx('loginBtn', 'userBtn')}>관리자</button>
            </Link>
          ) : (
            <Link href="/user/mypage">
              <button className={cx('loginBtn', 'userBtn')}>마이페이지</button>
            </Link>
          )}
        </div>
      </>
    )

  return (
    <>
      <IconButton
        className={styles.closeBtn}
        type="button"
        color="inherit"
        sx={{ p: '5px' }}
        onClick={() => onClose(false)}
      >
        <CloseIcon />
      </IconButton>
      <div className={cx('wrapper', toggleSubMenu && 'hide')}>
        <nav className={cx('menu')}>
          <ul>
            {navCategory.map((category) => (
              <li key={category} onClick={() => handleOpenSubMenu(category)}>
                {category.toUpperCase()}
              </li>
            ))}
          </ul>
        </nav>
        <div className={cx('user')}>{drawLoginBox()}</div>
        <ul className={cx('member')}>
          <li>
            <div
              className={cx('memberBtn')}
              onClick={() => router.push('/user/cart')}
            >
              <ShoppingBagOutlinedIcon fontSize="large" />
              <span>장바구니</span>
            </div>
          </li>
          <li>
            <div
              className={cx('memberBtn')}
              onClick={() => router.push('/user/mypage/wishlist')}
            >
              <FavoriteBorderOutlinedIcon fontSize="large" />
              <span>위시리스트</span>
            </div>
          </li>
        </ul>
      </div>
      <div className={cx('subMenu', toggleSubMenu && 'show')}>
        {menuItem && (
          <h2
            onClick={() => {
              setMenuItem('')
              setSubMenuItems([])
              settoggleSubMenu(false)
            }}
          >
            {menuItem.toUpperCase()}
          </h2>
        )}
        <ul>
          {menuItem && menuItem !== 'best' && (
            <li>
              <Link href={`/product/${menuItem}/best`}>BEST</Link>
            </li>
          )}
          {menuItem && (
            <li>
              <Link href={`/product/${menuItem}/all`}>ALL</Link>
            </li>
          )}
          {subMenuItems.map((item) => (
            <li key={item}>
              <Link href={`/product/${menuItem}/${item}`}>
                {item.toUpperCase()}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default DrawPage
