import styles from './ProductDetailPage.module.css'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)
import { IDetailPageProps } from 'pages/product/detail/[pid]'
import React, { useEffect, useState } from 'react'
import ProductOrder from './section/ProductOrder'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DetailCheck from './section/DetailCheck'
import ReviewSection from '@components/ReviewSection/ReviewSection'
import Axios from 'axios'
import { IReview } from '@models/Review'

const ProductDetailPage = ({ productDetail }: IDetailPageProps) => {
  const { product } = productDetail

  const [viewMore, setViewMore] = useState(false)
  const [reviews, setReviews] = useState<IReview[]>([])

  useEffect(() => {
    const update = { $inc: { views: 1 } }
    Axios.post('/api/product/updateProduct', { pid: product._id, update })

    Axios.post('/api/review/getProductReviews', { pid: product._id })
      .then((res) => {
        setReviews(res.data.reviews)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [product._id])

  return (
    <>
      <div className={styles.wrapper}>
        {/* 본문 */}
        <section className={cx('product')}>
          {/* 상품 상세정보 */}
          <div className={cx('product-content')}>
            <div className={styles.imgBox}>
              <img loading="lazy" src={product.image} alt={product.name} />
            </div>
            <div className={cx('product-info')}>
              <h1 className={styles.title}>
                {!product.is_event
                  ? product.name
                  : `[PIIC X ${product.event_name}] ${product.name}`}
              </h1>
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
                        <img
                          loading="lazy"
                          key={index}
                          src={image}
                          alt={image}
                        />
                      ))
                    ) : (
                      <img
                        loading="lazy"
                        src={product.image}
                        alt={product.name}
                      />
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
