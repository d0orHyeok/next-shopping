import styles from './ProductDetailPage.module.css'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)
import { IDetailPageProps } from 'pages/product/detail/[pid]'
import React, { useState } from 'react'
import ProductOrder from './section/ProductOrder'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DetailCheck from './section/DetailCheck'
import ReviewSection from '@components/ReviewSection/ReviewSection'

const ProductDetailPage = ({ productDetail, reviews }: IDetailPageProps) => {
  const { product } = productDetail

  const [viewMore, setViewMore] = useState(false)

  return (
    <>
      <div className={styles.wrapper}>
        {/* 본문 */}
        <section className={cx('product')}>
          {/* 상품 상세정보 */}
          <div className={cx('product-content')}>
            <div className={styles.imgBox}>
              <img src={product.image} alt={product.name} />
            </div>
            <div className={cx('product-info')}>
              <h1 className={styles.title}>{product.name}</h1>
              <p>{product.description}</p>
            </div>
            <h2 className={styles.subTitle}>Product View</h2>
            {!viewMore ? (
              <button
                className={styles.moreBtn}
                onClick={() => setViewMore(true)}
              >
                <span>상세정보 더 보기</span>
                <ExpandMoreIcon />
              </button>
            ) : (
              <>
                <div className={styles.subImgs}>
                  {[
                    product.subImages.length ? (
                      product.subImages.map((image, index) => (
                        <img key={index} src={image} alt={image} />
                      ))
                    ) : (
                      <img src={product.image} alt={product.name} />
                    ),
                  ]}
                </div>
                <h2 className={styles.subTitle}>Detail Check</h2>
                <div className={styles.detailCheck}>
                  <DetailCheck product={product} />
                </div>
              </>
            )}
          </div>

          {/* 상품 주문영역 */}
          <div className={cx('product-order')}>
            <ProductOrder product={product} />
          </div>
        </section>

        {/* 리뷰 영역 */}
        <ReviewSection pid={product._id} reviews={reviews} />
      </div>
    </>
  )
}

export default ProductDetailPage
