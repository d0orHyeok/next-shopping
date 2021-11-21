import Link from 'next/link'
// import { signIn } from 'next-auth/client'
import styles from './Navbar.module.css'
import classnames from 'classnames/bind'
import React, { useState } from 'react'

import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import Tooltip from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'
import { styled } from '@mui/material/styles'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

const cx = classnames.bind(styles)

const StyledBadge = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    top: 13,
    border: `1px solid white`,
    padding: '0 4px',
    background: 'rgb(252, 37, 37)',
    color: 'white',
  },
}))

const Navbar = (): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<HTMLInputElement | null>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLInputElement>): void => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = (): void => {
    setAnchorEl(null)
  }

  return (
    <header className={cx('header')}>
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
          </ul>
        </nav>

        {/* User Menu */}
        <div className={cx('member')}>
          <ul>
            {/* Search */}
            <li>
              <Tooltip title="Search" placeholder="bottom">
                <SearchOutlinedIcon
                  style={{ width: '2.4rem', height: '2.4rem' }}
                />
              </Tooltip>
            </li>

            {/* Account */}
            <li>
              <div onClick={handleClick}>
                <Tooltip title="Account" placeholder="bottom">
                  <PersonOutlineOutlinedIcon
                    style={{ width: '2.6rem', height: '2.6rem' }}
                  />
                </Tooltip>
              </div>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleClose}>Ordered</MenuItem>
                <MenuItem onClick={handleClose}>Logout</MenuItem>
              </Menu>
            </li>

            {/* Like, 찜 */}
            <li>
              <Tooltip title="Like" placeholder="bottom">
                <FavoriteBorderOutlinedIcon
                  style={{ width: '2.2rem', height: '2.2rem' }}
                />
              </Tooltip>
            </li>

            {/* Cart, 장바구니 */}
            <li>
              <Tooltip title="Cart" placeholder="bottom">
                <StyledBadge badgeContent={3}>
                  <ShoppingCartOutlinedIcon
                    style={{ width: '2.2rem', height: '2.2rem' }}
                  />
                </StyledBadge>
              </Tooltip>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}

export default Navbar
