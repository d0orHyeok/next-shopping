import Link from 'next/link'
import { signIn } from 'next-auth/client'
import styles from './Navbar.module.css'
import classnames from 'classnames/bind'

import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import Tooltip from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'
import { styled } from '@mui/material/styles'
import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'

const cx = classnames.bind(styles)

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
  return (
    <header className={cx('header')}>
      {/* Account Menu */}
      <div className={cx('pre-header')}>
        <ul>
          <li>
            <Link href="/api/auth/login">
              <a
                onClick={(e) => {
                  e.preventDefault()
                  signIn()
                }}
              >
                Sign In
              </a>
            </Link>
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
            <li>
              <div className={cx('search-wrapper')}>
                <IconButton type="button" color="inherit" sx={{ p: '5px' }}>
                  <SearchOutlinedIcon />
                </IconButton>
                <InputBase sx={{ width: '150px' }} placeholder="Search" />
              </div>
            </li>
            {/* Like, 찜 */}
            <li>
              <Link href="/user/wishlist">
                <Tooltip title="위시리스트" placeholder="bottom">
                  <IconButton type="button" color="inherit" sx={{ p: '5px' }}>
                    <FavoriteBorderOutlinedIcon />
                  </IconButton>
                </Tooltip>
              </Link>
            </li>

            {/* Cart, 장바구니 */}
            <li>
              <Link href="/user/cart">
                <Tooltip title="장바구니" placeholder="bottom">
                  <IconButton type="button" color="inherit" sx={{ p: '5px' }}>
                    <StyledBadge badgeContent={2}>
                      <ShoppingCartOutlinedIcon />
                    </StyledBadge>
                  </IconButton>
                </Tooltip>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}

export default Navbar
