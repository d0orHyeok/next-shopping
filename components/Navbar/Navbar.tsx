import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import Tooltip from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Drawer from '@mui/material/Drawer'
import Modal from '@mui/material/Modal'

import styles from './Navbar.module.css'
import classnames from 'classnames/bind'
const cx = classnames.bind(styles)
import SideNavBox from './sections/SideNavBox'
import SearchBox from './sections/SearchBox'
import LoginBox from '@components/LoginBox/LoginBox'

import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/dist/client/router'

type Anchor = 'menu' | 'search' | 'login'

const StyledDrawer = styled(Drawer)(() => ({
  '& .MuiBackdrop-root': {
    top: 'var(--header-height)',
  },
  '& .MuiPaper-root': {
    top: 'var(--header-height)',
  },
}))

const StyledBadge = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    top: 5,
    right: 5,
    padding: '10px 5px',
    fontSize: '14px',
    background: 'rgba(67, 67, 245, 1)',
    color: 'white',
    fontWeight: '600',
  },
}))

const Navbar = (): JSX.Element => {
  const router = useRouter()
  const [draw, setDraw] = useState({
    login: false,
    menu: false,
    search: false,
  })

  useEffect(() => {
    setDraw({
      login: false,
      menu: false,
      search: false,
    })
  }, [router])

  const toggleLogin = (open: boolean) => setDraw({ ...draw, login: open })
  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }

      setDraw({ ...draw, [anchor]: open })
    }

  return (
    <>
      <header className={cx('header')}>
        {/* Account Menu */}
        <div className={cx('pre-header')}>
          <ul>
            <li>
              <Link href="/register">회원가입</Link>
            </li>
            <span></span>
            <li>
              {/* <Link href="/login">로그인</Link> */}
              <a className={cx('loginBtn')} onClick={() => toggleLogin(true)}>
                로그인
              </a>
              <Modal open={draw['login']} onClose={() => toggleLogin(false)}>
                <div>
                  <LoginBox onClose={() => toggleLogin(false)} />
                </div>
              </Modal>
            </li>
          </ul>
        </div>
        <div className={cx('container')}>
          {/* Logo for Shopping mall */}
          <div className={cx('logo')}>
            {/* PIIC = Preaty & Comportable */}
            <Link href="/">PIIC</Link>
          </div>

          {/* Navigation: Menu for search products */}
          <nav className={cx('menu')}>
            <ul>
              <li>Best</li>
              <li>Men</li>
              <li>Women</li>
            </ul>
          </nav>

          {/* User Menu */}
          <div className={cx('member')}>
            <ul>
              {/* Search */}
              <li className={cx('search')}>
                <Tooltip title="검색" placeholder="bottom">
                  <IconButton
                    onClick={toggleDrawer('search', true)}
                    type="button"
                    color="inherit"
                    sx={{ p: '5px' }}
                  >
                    <SearchOutlinedIcon />
                  </IconButton>
                </Tooltip>
                <StyledDrawer
                  style={{ zIndex: 5 }}
                  anchor="top"
                  open={draw['search']}
                  onClose={toggleDrawer('search', false)}
                  ModalProps={{
                    keepMounted: true,
                    disableScrollLock: true,
                  }}
                >
                  <SearchBox
                    onClose={(open: boolean): void => {
                      setDraw({ ...draw, search: open })
                    }}
                  />
                </StyledDrawer>
              </li>
              {/* Like, 찜 */}
              <li className={cx('wishlist')}>
                <Link href="/user/wishlist">
                  <Tooltip title="위시리스트" placeholder="bottom">
                    <IconButton type="button" color="inherit" sx={{ p: '5px' }}>
                      <FavoriteBorderOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                </Link>
              </li>

              {/* Cart, 장바구니 */}
              <li className={cx('cart')}>
                <Link href="/user/cart">
                  <Tooltip title="장바구니" placeholder="bottom">
                    <IconButton type="button" color="inherit" sx={{ p: '5px' }}>
                      <StyledBadge badgeContent={2}>
                        <ShoppingBagOutlinedIcon />
                      </StyledBadge>
                    </IconButton>
                  </Tooltip>
                </Link>
              </li>
              {/* Drawer */}
              <li className={cx('drawer')}>
                <div className={cx('drawer-wrapper')}>
                  <IconButton
                    type="button"
                    color="inherit"
                    sx={{ p: '5px' }}
                    onClick={toggleDrawer('menu', true)}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Drawer
                    anchor="right"
                    open={draw['menu']}
                    onClose={toggleDrawer('menu', false)}
                  >
                    <SideNavBox
                      onClose={(open: boolean): void => {
                        setDraw({ ...draw, menu: open })
                      }}
                    />
                  </Drawer>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </>
  )
}

export default Navbar
