import styles from './ProductDetailPage.module.css'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)
import { IDetailPageProps } from 'pages/product/detail/[pid]'
import PreMenu from '@components/ProductViewPage/section/PreMenu'
import React from 'react'
import ProductOrder from './section/ProductOrder'

const ProductDetailPage = ({ productDetail }: IDetailPageProps) => {
  const { product } = productDetail

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.depth}>
          <PreMenu
            category={product.category}
            sx={{
              color: 'gray',
              fontSize: '0.9rem',
              margin: '1rem 0',
            }}
          />
        </div>
        {/* 본문 */}
        <div className={cx('product')}>
          {/* 상품 상세정보 */}
          <div className={cx('product-content')}>
            <div className={styles.imgBox}>
              <img src={product.image} alt={product.name} />
            </div>
            <h1 className={styles.title}>{product.name}</h1>
            <div className={styles.subImgs}>
              <h2 className={styles.subTitle}>Product View</h2>
            </div>
          </div>

          {/* 상품 주문영역 */}
          <ProductOrder product={product} />
        </div>
      </div>
    </>
  )
}

export default ProductDetailPage
