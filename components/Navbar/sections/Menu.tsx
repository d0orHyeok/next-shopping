import categoryData from 'public/data/category.json'
import React, { useEffect, useState } from 'react'
import styles from './Menu.module.css'
import classnames from 'classnames/bind'
const cx = classnames.bind(styles)
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Drawer } from '@mui/material'
import { styled } from '@mui/material/styles'
import Axios from 'axios'
import { IProduct } from '@models/Product'

interface IBestProducts {
  mainCategory: string
  products: IProduct[]
}

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

  const [isChange, setIsChange] = useState(-1)
  const [defaultItem, setDefaultItem] = useState(-1)
  const [selectedItem, setSelectedItem] = useState(-1)
  const [draw, setDraw] = useState(false)
  const [bestProducts, setBestProducts] = useState<IBestProducts>({
    mainCategory: '',
    products: [],
  })

  useEffect(() => {
    setDraw(false)

    const paths = router.asPath.split('/')
    const selected =
      paths.indexOf('product') === -1 ? -1 : navCategory.indexOf(paths[2])
    setDefaultItem(selected)
    setSelectedItem(selected)
  }, [router.asPath])

  useEffect(() => {
    if (selectedItem < 1) {
      return
    }

    const mainCategory = navCategory[selectedItem]
    if (mainCategory === bestProducts.mainCategory) {
      return
    }

    Axios.get(`/api/product/bestProducts?limit=3&category=${mainCategory}`)
      .then((res) =>
        setBestProducts({
          mainCategory,
          products: res.data.products,
        })
      )
      .catch((err) => console.log(err))
  }, [selectedItem])

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
            {bestProducts.mainCategory === mainCategory &&
              bestProducts.products.map((product, index) => (
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
              ))}
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
