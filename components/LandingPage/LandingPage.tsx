import { IBestProduct } from '@redux/features/productSlice'
import styles from './LandingPage.module.css'

interface LandingPageProps {
  bestProducts: IBestProduct[]
}

const LandingPage = ({ bestProducts }: LandingPageProps) => {
  return (
    <>
      <div className={styles.wrapper}>
        <section className={styles.home}>
          <video muted autoPlay loop>
            <source src="/videos/main_video.mp4" type="video/mp4" />
          </video>
        </section>
      </div>
    </>
  )
}

export default LandingPage
