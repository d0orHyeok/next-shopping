import { IProduct } from '@models/Product'
import styles from './ProductViewPage.module.css'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)
import * as getCategorys from '@libs/getCategory'
import { useEffect, useState } from 'react'
import PreMenu from './section/PreMenu'
import Grid from '@mui/material/Grid'
import ProductCard from '@components/utils/ProductCard/ProductCard'
import Link from 'next/link'
import Pagination from './section/Pagination'

export interface IProductViewPageProps {
  products: IProduct[]
  category: string[]
}

const ProductViewPage = ({ products, category }: IProductViewPageProps) => {
  const [navItems, setNavItems] = useState<string[]>([])
  const [pageIndex, setPageIndex] = useState(1)

  useEffect(() => {
    setPageIndex(1)

    if (!category) {
      return
    }
    if (category.length === 1 || category[category.length - 1] === 'best') {
      const items =
        category[0] === 'best'
          ? ['all', ...getCategorys.getMainCategorys()]
          : ['best', ...getCategorys.getSubCateogrys(category[0])]
      setNavItems(items)
    } else if (category.length > 1) {
      const items = getCategorys.getItemCategorys(category[0], category[1])
      setNavItems(['전체보기', ...items])
    }
  }, [category])

  return (
    <>
      <div className={styles.wrapper}>
        <PreMenu
          category={category}
          sx={{
            color: 'gray',
            fontSize: '0.9rem',
            margin: '1rem 0',
            float: 'right',
          }}
        />
        <div className={cx('main')}>
          <div className={styles.filter}>
            <h1 className={cx('title', 'title-underline')}>FILTER</h1>
          </div>
          <div className={styles.content}>
            <h1 className={styles.title}>
              {category[category.length - 1].toUpperCase()}
            </h1>
            <div className={styles.menu}>
              <div className={cx('menu-nav')}>
                <ul>
                  {navItems.map((item, index) => {
                    let href = `/product/${category.join('/')}/${item.replace(
                      '/',
                      ''
                    )}`
                    if (category[0] === 'best' && index > 0) {
                      href = `/product/${item}/best`
                    }
                    return (
                      <li className={cx('menu-nav-item')} key={index}>
                        <Link href={href}>{item.toUpperCase()}</Link>
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
            <div className={cx('product-container')}>
              <Grid container item columnSpacing={3} rowSpacing={8}>
                {products.map((product, index) => {
                  if (
                    index + 1 <= pageIndex * 15 &&
                    index + 1 > (pageIndex - 1) * 15
                  ) {
                    return (
                      <Grid key={index} item xs={4}>
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
