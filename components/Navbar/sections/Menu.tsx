import categoryData from 'public/data/category.json'
import React, { useEffect, useState } from 'react'
import styles from './Menu.module.css'
import classnames from 'classnames/bind'
const cx = classnames.bind(styles)
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Drawer } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useAppDispatch } from '@redux/hooks'
import { getBestProducts, IBestProducts } from '@redux/features/productSlice'

const navCategory = ['best', ...categoryData.map((item) => item.name)]

const StyledDrawer = styled(Drawer)(() => ({
  '& .MuiBackdrop-root': {
    top: 'var(--header-height)',
  },
  '& .MuiPaper-root': {
    top: 'var(--header-height)',
  },
}))

const Menu = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [isChange, setIsChange] = useState(-1)
  const [defaultItem, setDefaultItem] = useState(-1)
  const [selectedItem, setSelectedItem] = useState(-1)
  const [draw, setDraw] = useState(false)
  const [bestProducts, setBestProducts] = useState<IBestProducts[]>([])

  // URL 변화에 따라 드로워를 초기화하고 url에 맞는 선택표시
  useEffect(() => {
    setDraw(false)

    const paths = router.asPath.split('/')
    const selected =
      paths.indexOf('product') === -1 ? -1 : navCategory.indexOf(paths[2])
    setDefaultItem(selected)
    setSelectedItem(selected)

    if (!bestProducts.length) {
      dispatch(getBestProducts('all'))
        .unwrap()
        .then((res) => setBestProducts(res.bestProducts))
        .catch((err) => console.log(err))
    }
  }, [router.asPath])

  const drawCategoryMenu = (index: number) => {
    if (index < 1) {
      return
    }
    const mainCategory = navCategory[index]
    const subCategoryData = categoryData[index - 1].value.map(
      (item) => item.name
    )

    return (
      <>
        {isChange !== selectedItem && <span className={styles.fade}></span>}
        <div className={cx('draw-menu')} onMouseLeave={() => setDraw(false)}>
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

          <ul className={styles.imgBox}>
            {bestProducts
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
                        data-price={`${product.price.toLocaleString('ko-KR')}₩`}
                      >
                        <img src={product.image} alt={product.name} />
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
      <div
        onMouseLeave={() => {
          setSelectedItem(defaultItem)
          setDraw(false)
        }}
      >
        <ul className={cx('menu', draw && 'hover')}>
          {navCategory.map((category, index) => (
            <li
              key={`menu${index}`}
              onMouseOver={() => {
                setSelectedItem(index)
                setDraw(true)
              }}
              onMouseLeave={() => {
                index === 0 && setDraw(false)
                setIsChange(index)
              }}
              className={cx('item', selectedItem === index && 'selected')}
            >
              <Link href={`/product/${category}/all`}>
                {category.toUpperCase()}
              </Link>
            </li>
          ))}
        </ul>
        <StyledDrawer
          transitionDuration={{ appear: 0 }}
          style={{ zIndex: 5 }}
          anchor="top"
          open={draw}
          onClose={() => setDraw(false)}
          ModalProps={{ disableScrollLock: true }}
        >
          {drawCategoryMenu(selectedItem)}
        </StyledDrawer>
      </div>
    </>
  )
}

export default Menu
