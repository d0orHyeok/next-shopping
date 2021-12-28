import CloseIcon from '@mui/icons-material/Close'
import styles from './AddCartModal.module.css'
import classNames from 'classnames/bind'
import { useRouter } from 'next/router'
const cx = classNames.bind(styles)

interface IAddCartModalProps {
  open: boolean
  onClose: () => void
}

const AddCartModal = ({ open, onClose }: IAddCartModalProps) => {
  const router = useRouter()
  return (
    <>
      <div className={cx('wrapper', open && 'open')}>
        <div className={styles.container}>
          <div className={styles.title}>
            <h1>장바구니 담기</h1>
            <button onClick={onClose}>
              <CloseIcon fontSize="small" />
            </button>
          </div>
          <div className={styles.content}>
            <span className={styles.logo}>PIIC</span>
            <p>장바구니에 상품이 담겼습니다.</p>
          </div>
          <div className={styles.buttonWrapper}>
            <button
              className={styles.moveBtn}
              onClick={() => router.push('/user/cart')}
            >
              장바구니 이동
            </button>
            <button className={styles.closeBtn} onClick={onClose}>
              쇼핑계속하기
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddCartModal
