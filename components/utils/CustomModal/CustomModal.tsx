import CloseIcon from '@mui/icons-material/Close'
import styles from './CustomModal.module.css'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)

interface ICustomModalProps {
  children?: React.ReactChild | React.ReactChildren
  title: string
  submitText: string
  cancelText: string
  open: boolean
  onClose: () => void
  onSubmit?: () => void
}

const CustomModal = ({
  children,
  submitText,
  cancelText,
  title,
  open,
  onClose,
  onSubmit,
}: ICustomModalProps) => {
  return (
    <>
      <div className={cx('wrapper', open && 'open')}>
        <div className={styles.container}>
          <div className={styles.title}>
            <h1>{title}</h1>
            <button onClick={onClose}>
              <CloseIcon fontSize="small" />
            </button>
          </div>
          <div className={styles.content}>{children}</div>
          <div className={styles.buttonWrapper}>
            <button className={styles.moveBtn} onClick={onSubmit}>
              {submitText}
            </button>
            <button className={styles.closeBtn} onClick={onClose}>
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CustomModal
