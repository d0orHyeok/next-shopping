import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import LoginModal from '@components/utils/LoginModal/LoginModal'

import styles from './SideNavBox.module.css'
import classnames from 'classnames/bind'
const cx = classnames.bind(styles)

import Link from 'next/link'
import React, { useState } from 'react'
import { selectUser, userLogout } from '@redux/features/userSlice'
import { useAppSelector, useAppDispatch } from '@redux/hooks'
import categoryData from 'public/data/category.json'

const navCategory = ['best', ...categoryData.map((item) => item.name)]

interface DrawPageProops {
  onClose?: (open: boolean) => void
}

const DrawPage = ({ onClose }: DrawPageProops) => {
  const dispatch = useAppDispatch()

  const user = useAppSelector(selectUser)

  const [open, setOpen] = useState(false)
  const [toggleSubMenu, settoggleSubMenu] = useState(false)
  const [menuItem, setMenuItem] = useState('')
  const [subMenuItems, setSubMenuItems] = useState<string[]>([])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleOpenSubMenu = (name: string) => {
    setMenuItem(name)
    if (name !== 'best') {
      const newSubMenuItems = categoryData
        .filter((item) => item.name === name)[0]
        .value.map((item) => item.name)
      setSubMenuItems(newSubMenuItems)
    }
    settoggleSubMenu(true)
  }
  const handleCloseSubMenu = () => {
    setMenuItem('')
    setSubMenuItems([])
    settoggleSubMenu(false)
  }

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
      <IconButton
        className={styles.closeBtn}
        type="button"
        color="inherit"
        sx={{ p: '5px' }}
        onClick={() => onClose && onClose(false)}
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
      <div className={cx('subMenu', toggleSubMenu && 'show')}>
        {menuItem && (
          <h2 onClick={handleCloseSubMenu}>{menuItem.toUpperCase()}</h2>
        )}
        <ul>
          {menuItem !== 'best' && (
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
