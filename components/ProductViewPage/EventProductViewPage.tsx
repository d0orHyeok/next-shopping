import { IProduct } from '@models/Product'
import styles from './ProductViewPage.module.css'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)
import React, { useCallback, useEffect, useRef, useState } from 'react'
import PreMenu from './section/PreMenu'
import Grid from '@mui/material/Grid'
import ProductCard from '@components/utils/ProductCard/ProductCard'
import Link from 'next/link'
import Pagination from '../utils/Pagination/Pagination'
import { debounce } from 'lodash'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { Drawer, Popover } from '@mui/material'
import { withRouter, NextRouter } from 'next/router'
import Filter from './section/Filter'
import { IFilterOptions } from '@api/product/getFilterOptions'

export interface IProductViewPageProps {
  router: NextRouter
  products: IProduct[]
  filterOptions: IFilterOptions
}

const sortData = [
  { data: 'sold_desc', label: '인기상품' },
  { data: 'createdAt_desc', label: '신상품' },
  { data: 'name_asc', label: '상품명' },
  { data: 'price_asc', label: '낮은가격' },
  { data: 'price_desc', label: '높은가격' },
  { data: 'reviews_desc', label: '상품후기' },
  { data: 'views_desc', label: '조회수' },
  { data: 'likes_desc', label: '좋아요' },
]

const ProductViewPage = ({
  router,
  products,
  filterOptions,
}: IProductViewPageProps) => {
  // menu에 표시할 item과 href 주소
  const navItems = { items: ['EVENT'], hrefs: ['/product/event'] }
  const navIndex = 0
  const [pageIndex, setPageIndex] = useState(1) // 현재 조회중인 페이지번호
  const [drawBtn, setDrawBtn] = useState(false) // menu의 좌우 이동버튼을 그릴지 여부
  const [draw, setDraw] = useState(false) // filter 드로워 on/off state
  const [openedPopover, setOpenedPopover] = useState(false)
  const popoverAnchor = useRef(null)
  const menuRef = useRef<HTMLUListElement>(null)
  const sortLabelRef = useRef<HTMLSpanElement>(null)

  // 반응형일 때 filter drawer
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

  // 상품정렬 Popover
  const popoverEnter = useCallback(() => {
    setOpenedPopover(true)
  }, [openedPopover])

  const popoverLeave = useCallback(() => {
    setOpenedPopover(false)
  }, [openedPopover])

  const handleSort = (event: React.MouseEvent<HTMLLIElement>) => {
    const sort = event.currentTarget.getAttribute('data-name')
    const href = { pathname: router.pathname, query: { ...router.query, sort } }
    router.push(href)
  }

  // menu에 스크롤 이벤트 있는지 확인하는 함수
  const handleResize = debounce(() => {
    menuRef.current !== null &&
    menuRef.current.offsetWidth !== menuRef.current.scrollWidth
      ? setDrawBtn(true)
      : setDrawBtn(false)
  }, 200)

  // menu 스크롤 좌우 이동
  const moveMenu = (move: number) => {
    if (menuRef.current !== null) {
      menuRef.current.scrollTo({
        left: menuRef.current.scrollLeft + move,
        behavior: 'smooth',
      })
    }
  }

  useEffect(() => {
    if (menuRef.current !== null) {
      window.addEventListener('resize', handleResize)
    }
    return window.addEventListener('resize', handleResize)
  }, [menuRef.current])

  // 주소변화시 변수 초기화
  useEffect(() => {
    handleResize()
    setDraw(false)

    if (sortLabelRef.current !== null) {
      const label = sortData.find((data) => data.data === router.query?.sort)
      sortLabelRef.current.textContent =
        label !== undefined ? label.label : '상품정렬'
    }
  }, [router.query])

  return (
    <>
      <div className={styles.wrapper}>
        {/* 현재 조회중인 페이지 depths */}
        <div className={styles.preMenu}>
          <PreMenu
            is_event={true}
            sx={{
              color: 'gray',
              fontSize: '0.9rem',
              margin: '1rem 0',
              float: 'right',
            }}
          />
        </div>
        {/* 상품페이지 본문 */}
        <div className={cx('main')}>
          {/* Filter Area */}
          <div className={styles.filter}>
            <h1 className={cx('title', 'title-underline')}>FILTER</h1>
            <Filter filterOptions={filterOptions} />
          </div>
          {/* Contents Area */}
          <div className={styles.content}>
            <h1 className={styles.title}>
              EVENT
              {/* 반응형 필터 버튼 및 Drawer */}
              <button
                className={cx('filter-media')}
                onClick={toggleDrawer(true)}
              >
                FILTER
              </button>
              <Drawer anchor="bottom" open={draw} onClose={toggleDrawer(false)}>
                <div className={cx('drawFilter')}>
                  <h1 className={cx('title', 'title-underline')}>FILTER</h1>
                  <Filter filterOptions={filterOptions} />
                </div>
              </Drawer>
            </h1>
            {/* 상품 카테고리 메뉴 */}
            <div className={styles.menu}>
              <div className={cx('menu-nav')}>
                <ul ref={menuRef}>
                  {drawBtn && (
                    <>
                      <button
                        className={cx('menuBtn', 'menuBtn-left')}
                        onClick={() => moveMenu(-80)}
                      >
                        <KeyboardArrowLeftIcon />
                      </button>
                      <button
                        className={cx('menuBtn', 'menuBtn-right')}
                        onClick={() => moveMenu(80)}
                      >
                        <KeyboardArrowRightIcon />
                      </button>
                    </>
                  )}
                  {navItems.items.map((item, index) => {
                    return (
                      <li
                        className={cx(
                          'menu-nav-item',
                          index === navIndex && 'menu-nav-itemSelect'
                        )}
                        key={index}
                      >
                        <Link href={navItems.hrefs[index]}>
                          {item.toUpperCase()}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
              <div className={cx('menu-normal')}>
                <div className={cx('count', 'menu-normal-item')}>
                  {products.length}
                </div>
                <div
                  className={cx('sort', 'menu-normal-item')}
                  ref={popoverAnchor}
                  aria-owns="mouse-over-popover"
                  aria-haspopup="true"
                  onMouseEnter={popoverEnter}
                  onMouseLeave={popoverLeave}
                >
                  {/* 상품정렬 */}
                  <span ref={sortLabelRef}>상품정렬</span>
                  <Popover
                    disableScrollLock={true}
                    id="mouse-over-popover"
                    sx={{ pointerEvents: 'none' }}
                    open={openedPopover}
                    anchorEl={popoverAnchor.current}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                    PaperProps={{
                      sx: {
                        pointerEvents: 'auto',
                        boxShadow: 'none',
                        width: '115px',
                        overflow: 'hidden',
                      },
                      onMouseEnter: popoverEnter,
                      onMouseLeave: popoverLeave,
                    }}
                  >
                    <ul className={cx('popover')}>
                      {sortData.map((data, index) => (
                        <li
                          key={index}
                          onClick={handleSort}
                          data-name={data.data}
                        >
                          {data.label}
                        </li>
                      ))}
                    </ul>
                  </Popover>
                </div>
              </div>
            </div>
            {/* 상품 목록 */}
            <div className={cx('product-container')}>
              <Grid container item columnSpacing={3} rowSpacing={8}>
                {products.map((product, index) => {
                  if (
                    index + 1 <= pageIndex * 15 &&
                    index + 1 > (pageIndex - 1) * 15
                  ) {
                    return (
                      <Grid key={index} item xs={6} sm={6} md={4}>
                        <ProductCard product={product} />
                      </Grid>
                    )
                  }
                })}
              </Grid>
              <div style={{ marginTop: '50px' }}>
                <Pagination
                  itemNum={products.length}
                  displayNum={15}
                  onChange={setPageIndex}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default withRouter(ProductViewPage)
