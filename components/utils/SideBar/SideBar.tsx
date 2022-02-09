import styles from './SideBar.module.css'
import classNames from 'classnames/bind'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import React from 'react'

const cx = classNames.bind(styles)

const SideBar = () => {
  const moveScroll = (anchor: 'top' | 'bottom') => {
    if (window) {
      const value =
        anchor === 'top' ? 0 : document.getElementById('__next')?.scrollHeight
      window.scrollTo({ top: value, behavior: 'smooth' })
    }
  }

  return (
    <>
      <div className={cx('wrapper')}>
        <div className={cx('container')}>
          <button
            className={cx('btn', 'top')}
            onClick={() => moveScroll('top')}
          >
            <ArrowForwardIosIcon />
          </button>
          <button
            className={cx('btn', 'bottom')}
            onClick={() => moveScroll('bottom')}
          >
            <ArrowForwardIosIcon />
          </button>
        </div>
      </div>
    </>
  )
}

export default SideBar
