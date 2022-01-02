import Link from 'next/link'
import styles from './UserNav.module.css'
import classNames from 'classnames/bind'
import React from 'react'
const cx = classNames.bind(styles)

interface IUserNavProps {
  clasName?: string
  sx?: React.CSSProperties
}

const UserNav = ({ clasName, sx }: IUserNavProps) => {
  return (
    <nav className={clasName} style={sx}>
      <div className={cx('nav-item')}>
        <h3 className={cx('nav-title')}>쇼핑 정보</h3>
        <ul>
          <li>
            <Link href="#">주문/배송</Link>
          </li>
          <li>
            <Link href="#">취소</Link>
          </li>
        </ul>
      </div>
      <div className={cx('nav-item')}>
        <h3 className={cx('nav-title')}>활동 정보</h3>
        <ul>
          <li>
            <Link href="#">회원정보 수정</Link>
          </li>
          <li>
            <Link href="#">회원탈퇴</Link>
          </li>
          <li>
            <Link href="#">배송 주소 관리</Link>
          </li>
          <li>
            <Link href="/user/wishlist">위시리스트</Link>
          </li>
          <li>
            <Link href="/user/cart">장바구니</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default UserNav
