import { IProduct } from '@models/Product'
import styles from './LandingPage.module.css'
import classnames from 'classnames/bind'
const cx = classnames.bind(styles)
import Link from 'next/link'
import Carousel from '@components/utils/Carousel/Carousel'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'

interface LandingPageProps {
  bestProducts: IProduct[]
  newProducts: IProduct[]
}

const LandingPage = ({ bestProducts, newProducts }: LandingPageProps) => {
  return (
    <>
      <div className={styles.wrapper}>
        {/* 최상단 이벤트 */}
        <article className={styles.home}>
          <div className={cx('home-desc')}>
            <h1>
              <span className={styles.logo}>PIIC</span> X NIGHT GLOW
            </h1>
            <p>
              <span className={styles.logo}>PIIC</span>과 NIGTH GLOW 콜라보
              아우터 상품을 살펴보세요
            </p>
            <Link href="/product/event">
              <button className={cx('home-eventBtn')}>VIEW</button>
            </Link>
          </div>
          <video muted autoPlay loop>
            <source src="/videos/main.mp4" type="video/mp4" />
          </video>
        </article>
        {/* 신상 */}
        <section className={styles.section}>
          <h2 className={styles.title}>What&#39;s New?</h2>
          <Carousel autoPlay={true}>
            {newProducts.map((product, index) => {
              return (
                <div key={index} className={cx('card-wrapper')}>
                  <div className={cx('thumbnail')}>
                    <Link href={`/product/detail/${product._id}`}>
                      <img src={product.image} alt={product.name} />
                    </Link>
                  </div>
                  <ul className={cx('card-description')}>
                    <li className={styles.name}>
                      <Link href={`/product/detail/${product._id}`}>
                        {product.name}
                      </Link>
                      <FavoriteBorderOutlinedIcon />
                    </li>
                    <li className={styles.priceBox}>
                      <span className={styles.price}>
                        {`${product.price.toLocaleString('ko-KR')}`}
                      </span>
                    </li>
                    <li className={styles.reviewBox}>
                      <span className={styles.review}>{product.reviews}</span>
                    </li>
                  </ul>
                </div>
              )
            })}
          </Carousel>
        </section>
        {/* 판매 베스트 상품 */}

        <section className={styles.section}>
          <h2 className={styles.title}>
            <span className={styles.logo}>PIIC</span>&#39;s Best
          </h2>
          <Carousel autoPlay={true}>
            {bestProducts.map((product, index) => {
              return (
                <div key={index} className={cx('card-wrapper')}>
                  <div className={cx('thumbnail')}>
                    <Link href={`/product/detail/${product._id}`}>
                      <img src={product.image} alt={product.name} />
                    </Link>
                  </div>
                  <ul className={cx('card-description')}>
                    <li className={styles.name}>
                      <Link href={`/product/detail/${product._id}`}>
                        {product.name}
                      </Link>
                      <FavoriteBorderOutlinedIcon />
                    </li>
                    <li className={styles.priceBox}>
                      <span className={styles.price}>
                        {`${product.price.toLocaleString('ko-KR')}`}
                      </span>
                    </li>
                    <li className={styles.reviewBox}>
                      <span className={styles.review}>{product.reviews}</span>
                    </li>
                  </ul>
                </div>
              )
            })}
          </Carousel>
        </section>
      </div>
    </>
  )
}

export default LandingPage
