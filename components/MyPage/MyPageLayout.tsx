import styles from './MyPageLayout.module.css'
import UserNav from './section/UserNav'
import classNames from 'classnames/bind'
import { useState } from 'react'
import { Drawer } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'

const cx = classNames.bind(styles)

interface IMyPageProps {
  title?: string
  children?: React.ReactNode
  contentStyle?: React.CSSProperties
  contentTitleUnderline?: boolean
}

const MyPageLayout = ({
  children,
  title = '마이페이지',
  contentStyle,
  contentTitleUnderline = true,
}: IMyPageProps) => {
  const [draw, setDraw] = useState(false)

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }

      setDraw(open)
    }

  return (
    <>
      <section className={styles.wrapper}>
        <div className={styles.head}>
          <h1 className={styles.title}>{title}</h1>
        </div>
        <div className={styles.container}>
          <div className={styles.nav}>
            <h2 className={cx('subTitle', 'underline')}>마이페이지</h2>
            <UserNav sx={{ paddingTop: '1rem' }} />
          </div>

          <div className={styles.content} style={contentStyle}>
            <h2
              className={cx('subTitle', contentTitleUnderline && 'underline')}
            >
              <button className={cx('drawerBtn')} onClick={toggleDrawer(true)}>
                <MenuIcon />
                <span>마이페이지</span>
              </button>
            </h2>
            {children}
          </div>
        </div>
      </section>
      <Drawer
        anchor="left"
        open={draw}
        onClose={toggleDrawer(false)}
        disableScrollLock={true}
      >
        <div className={cx('drawer')}>
          <UserNav sx={{ paddingTop: '1rem' }} />
        </div>
      </Drawer>
    </>
  )
}

export default MyPageLayout
