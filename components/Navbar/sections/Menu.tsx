import React, { useEffect, useState } from 'react'
import styles from './Menu.module.css'
import classnames from 'classnames/bind'
const cx = classnames.bind(styles)
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Drawer } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useAppDispatch, useAppSelector } from '@redux/hooks'
import {
  getBestProducts,
  IBestProduct,
  selectProduct,
} from '@redux/features/productSlice'
import * as getCategorys from '@libs/getCategory'

interface MenuProps {
  draw: boolean
  setDraw: (open: boolean) => void
}

const navCategory = ['best', ...getCategorys.getMainCategorys()]

const StyledDrawer = styled(Drawer)(() => ({
  '& .MuiBackdrop-root': {
    top: 'var(--header-height)',
  },
  '& .MuiPaper-root': {
    top: 'var(--header-height)',
  },
}))

const Menu = ({ draw, setDraw }: MenuProps) => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const bestProducts: IBestProduct[] =
    useAppSelector(selectProduct).bestProducts
  const [defaultItem, setDefaultItem] = useState(-1)
  const [selectedItem, setSelectedItem] = useState(-1)

  // URL 변화에 따라 드로워를 초기화하고 url에 맞는 선택표시
  useEffect(() => {
    const paths = router.asPath.split('/')
    const selected =
      paths.indexOf('product') === -1 ? -1 : navCategory.indexOf(paths[2])
    setDefaultItem(selected)
    setSelectedItem(selected)
  }, [router.asPath])

  useEffect(() => {
    !draw && setSelectedItem(defaultItem)
  }, [draw])

  const onCloseMenu = () => {
    setDraw(false)
  }

  useEffect(() => {
    if (!bestProducts.length) {
      dispatch(getBestProducts())
    }
  }, [bestProducts])

  const drawCategoryMenu = (selectedIndex: number) => {
    const mainCategory = navCategory[selectedIndex]
    const subCategoryData = getCategorys.getSubCateogrys(mainCategory)

    return (
      <>
        {/* 서브 카테고리 메뉴 */}
        <div className={cx('draw-menu')} onMouseLeave={onCloseMenu}>
          <ul className={styles.common}>
            <li>
              <Link href={`/product/${mainCategory}/best`}>BEST</Link>
            </li>
            <li>
              <Link href={`/product/${mainCategory}/all`}>ALL</Link>
            </li>
          </ul>
          <div>
            <ul className={styles.subMenu}>
              {subCategoryData.map((item, index) => (
                <li key={`subMenu${index}`}>
                  <Link href={`/product/${mainCategory}/${item}`}>
                    {item.toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* 베스트 상품 이미지 */}
          <ul className={styles.imgBox}>
            {bestProducts.length &&
              bestProducts
                .filter((item) => item.mainCategory === mainCategory)[0]
                .products.map(
                  (product, index) =>
                    index < 3 && (
                      <Link
                        key={`img${index}`}
                        href={`/product/detail/${product._id}`}
                      >
                        <li
                          data-title={`${
                            product.name.length < 15
                              ? product.name
                              : product.name.slice(0, 16) + '...'
                          }`}
                          data-price={`${product.price.toLocaleString(
                            'ko-KR'
                          )}`}
                        >
                          <img
                            loading="lazy"
                            src={product.image}
                            alt={product.name}
                          />
                        </li>
                      </Link>
                    )
                )}
          </ul>
        </div>
      </>
    )
  }

  return (
    <>
      <div onMouseLeave={() => setDraw(false)}>
        <ul className={cx('menu', draw && 'hover')}>
          {navCategory.map((category, index) => (
            <li
              key={`menu${index}`}
              onMouseOver={() => {
                setSelectedItem(index)
                setDraw(true)
              }}
              className={cx('item', selectedItem === index && 'selected')}
            >
              <Link href={`/product/${category}/all`}>
                {category.toUpperCase()}
              </Link>
            </li>
          ))}
        </ul>
        {draw && selectedItem !== 0 && (
          <StyledDrawer
            transitionDuration={{ appear: 0, enter: 0, exit: 0 }}
            style={{ zIndex: 5 }}
            anchor="top"
            open={draw}
            onClose={onCloseMenu}
            ModalProps={{ disableScrollLock: true }}
          >
            {drawCategoryMenu(selectedItem)}
          </StyledDrawer>
        )}
      </div>
    </>
  )
}

export default Menu
