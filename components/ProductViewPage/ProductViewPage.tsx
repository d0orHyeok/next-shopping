import { IProduct } from '@models/Product'
import styles from './ProductViewPage.module.css'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)
import * as getCategorys from '@libs/getCategory'
import { useEffect, useRef, useState } from 'react'
import PreMenu from './section/PreMenu'
import Grid from '@mui/material/Grid'
import ProductCard from '@components/utils/ProductCard/ProductCard'
import Link from 'next/link'
import Pagination from './section/Pagination'
import { debounce } from 'lodash'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import Drawer from '@mui/material/Drawer'

export interface IProductViewPageProps {
  products: IProduct[]
  category: string[]
}

interface QueryHref {
  pathname: string
  query?: {
    itemCategory: string
  }
}

interface navItemState {
  items: string[]
  hrefs: string[] | QueryHref[]
}

const ProductViewPage = ({ products, category }: IProductViewPageProps) => {
  // menu에 스크롤이 있는지 확인
  const menuRef = useRef<HTMLUListElement>(null)

  const handleResize = debounce(() => {
    menuRef.current !== null &&
    menuRef.current.offsetWidth !== menuRef.current.scrollWidth
      ? setDrawBtn(true)
      : setDrawBtn(false)
  }, 200)

  useEffect(() => {
    handleResize()
  }, [])

  useEffect(() => {
    if (menuRef.current !== null) {
      window.addEventListener('resize', handleResize)
    }
    return window.addEventListener('resize', handleResize)
  }, [menuRef.current])

  const moveMenu = (move: number) => {
    if (menuRef.current !== null) {
      menuRef.current.scrollTo({
        left: menuRef.current.scrollLeft + move,
        behavior: 'smooth',
      })
    }
  }

  // menu에 표시할 item과 href 주소
  const [navItems, setNavItems] = useState<navItemState>({
    items: [],
    hrefs: [],
  })
  const [pageIndex, setPageIndex] = useState(1) // 현재 조회중인 페이지번호
  const [drawBtn, setDrawBtn] = useState(false) // menu의 좌우 이동버튼을 그릴지 여부
  const [draw, setDraw] = useState(false) // filter 드로워 on/off state

  // 페이지 접속 시 navItems를 세팅한다
  useEffect(() => {
    setPageIndex(1)

    if (!category) {
      return
    }
    let items: string[] = []
    const hrefs: any[] = []
    if (category.length === 1 || category[category.length - 1] === 'best') {
      // 메인카테고리 조회 or 베스트 상품조회 페이지 일 때
      if (category[0] === 'best') {
        items = ['all', ...getCategorys.getMainCategorys()]
        items.forEach((item) => {
          const href =
            item === 'best' ? '/product/best' : `/product/${item}/best`
          hrefs.push(href)
        })
      } else {
        items = ['best', ...getCategorys.getSubCateogrys(category[0])]
        items.forEach((item) => {
          hrefs.push(`/product/${category[0]}/${item}`)
        })
      }
      setNavItems({ items, hrefs })
    } else {
      // 서브카테고리나 마지막카테고리 조회 페이지 일 때
      const items: string[] = [
        '전체보기',
        ...getCategorys.getItemCategorys(category[0], category[1]),
      ]
      items.forEach((item, index) => {
        // 마지막 카테고리에 대한 href는 query 사용
        const href =
          index === 0
            ? {
                pathname: `/product/${category[0]}/${category[1]}`,
              }
            : {
                pathname: `/product/${category[0]}/${category[1]}`,
                query: {
                  itemCategory: item,
                },
              }
        hrefs.push(href)
      })
      setNavItems({ items, hrefs })
    }
  }, [category])

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

  return (
    <>
      <div className={styles.wrapper}>
        {/* 현재 조회중인 페이지 depths, home > [mainCategory] > [subCategory] */}
        <div className={styles.preMenu}>
          <PreMenu
            category={category}
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
          </div>
          {/* Contents Area */}
          <div className={styles.content}>
            <h1 className={styles.title}>
              {category[category.length - 1].toUpperCase()}
              {/* 반응형 필터 버튼 및 Drawer */}
              <button
                className={cx('filter-media')}
                onClick={toggleDrawer(true)}
              >
                FILTER
              </button>
              <Drawer anchor="bottom" open={draw} onClose={toggleDrawer(false)}>
                <div className={cx('drawFilter')}>
                  <div className={cx('drawFilter-nav')}>
                    {navItems.items.map((item, index) => {
                      return (
                        <button
                          className={cx('drawFilter-nav-item')}
                          key={index}
                          onClick={() => setDraw(false)}
                        >
                          <Link href={navItems.hrefs[index]}>
                            {item.toUpperCase()}
                          </Link>
                        </button>
                      )
                    })}
                  </div>
                  <h1 className={cx('title', 'title-underline')}>FILTER</h1>
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
                      <li className={cx('menu-nav-item')} key={index}>
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
                <div className={cx('order', 'menu-normal-item')}>상품정렬</div>
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

export default ProductViewPage
