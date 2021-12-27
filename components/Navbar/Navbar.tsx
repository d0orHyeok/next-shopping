import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import { Tooltip, Badge, IconButton, Drawer } from '@mui/material'
import { styled } from '@mui/material/styles'
import styles from './Navbar.module.css'
import classnames from 'classnames/bind'
const cx = classnames.bind(styles)
import SideNavBox from './sections/SideNavBox'
import SearchBox from './sections/SearchBox'
import Preheader from './sections/Preheader'
import Menu from './sections/Menu'
import Link from 'next/link'
import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/dist/client/router'
import { useAppSelector, useAppDispatch } from '@redux/hooks'
import {
  IUserState,
  selectUser,
  getStorageLikes,
} from '@redux/features/userSlice'

type Anchor = 'menu' | 'search' | 'side'

interface IndexPageNavbarProps {
  isHome?: boolean
  isDark?: boolean
  setIsDark?: (isDark: boolean) => void
}

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

const Navbar = ({
  isHome,
  isDark,
  setIsDark,
}: IndexPageNavbarProps): JSX.Element => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const user: IUserState = useAppSelector(selectUser)
  const [draw, setDraw] = useState({
    menu: false,
    search: false,
    side: false,
  })

  useEffect(() => {
    setDraw({
      menu: false,
      search: false,
      side: false,
    })
    dispatch(getStorageLikes())
  }, [router])

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

  const passDraw = useCallback(
    (open: boolean) => {
      setDraw({ ...draw, ['menu']: open })
    },
    [draw]
  )

  // indexpage 에서 navbar 투명하게할지 설정해주는 함수
  const handleMouseOver = (event: React.MouseEvent<HTMLElement>) => {
    if (isHome && setIsDark) {
      if (event.clientY < 91 || draw.menu || draw.search || draw.side) {
        setIsDark(false)
      } else {
        setIsDark(true)
      }
    }
  }

  return (
    <>
      <header
        className={cx('header', isDark && isHome && 'isHome')}
        onMouseMove={handleMouseOver}
        onMouseOut={() => setIsDark && setIsDark(true)}
      >
        {/* PreHeader : Account Menu */}
        <Preheader isHome={isDark && isHome} />
        {/* Main Header */}
        <div className={cx('container')}>
          {/* Logo for Shopping mall */}
          <div className={cx('logo')}>
            {/* PIIC = Preaty & Comportable */}
            <Link href="/">PIIC</Link>
          </div>

          {/* Navigation: Menu for search products */}
          <nav className={cx('menu')}>
            <Menu passDraw={passDraw} />
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
                  ModalProps={{ disableScrollLock: true }}
                >
                  <SearchBox
                    onClose={(open: boolean): void => {
                      setDraw({ ...draw, search: open })
                    }}
                  />
                </StyledDrawer>
              </li>
              {/* Like, 찜 */}
              <li
                className={cx('wishlist')}
                onClick={() => router.push('/user/wishlist')}
              >
                <Tooltip title="위시리스트" placeholder="bottom">
                  <IconButton type="button" color="inherit" sx={{ p: '5px' }}>
                    <FavoriteBorderOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </li>

              {/* Cart, 장바구니 */}
              <li
                className={cx('cart')}
                onClick={() => router.push('/user/cart')}
              >
                <Tooltip title="장바구니" placeholder="bottom">
                  <IconButton type="button" color="inherit" sx={{ p: '5px' }}>
                    <StyledBadge badgeContent={user.userData?.cart.length}>
                      <ShoppingBagOutlinedIcon />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </li>
              {/* Drawer */}
              <li className={cx('drawer')}>
                <div className={cx('drawer-wrapper')}>
                  <IconButton
                    type="button"
                    color="inherit"
                    sx={{ p: '5px' }}
                    onClick={toggleDrawer('side', true)}
                  >
                    <MenuIcon />
                  </IconButton>
                  <Drawer
                    anchor="right"
                    open={draw['side']}
                    onClose={toggleDrawer('side', false)}
                  >
                    <SideNavBox
                      onClose={(open: boolean): void => {
                        setDraw({ ...draw, side: open })
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
