import DaumPostcode from 'react-daum-postcode'
import styles from './DaumPostCodeModal.module.css'
import classNames from 'classnames/bind'
import CloseIcon from '@mui/icons-material/Close'

const cx = classNames.bind(styles)

interface IDaumPostCodeModalProps {
  open: boolean
  onClose: () => void
  onSubmit?: (zonecode: string, fullAddress: string) => void
}

const DaumPostCodeModal = ({
  open,
  onClose,
  onSubmit,
}: IDaumPostCodeModalProps) => {
  const handleComplete = (data: any) => {
    let fullAddress = data.address
    let extraAddress = ''

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname
      }
      if (data.buildingName !== '') {
        extraAddress +=
          extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : ''
    }

    onSubmit && onSubmit(data.zonecode, fullAddress)
    onClose()
  }

  return (
    <div className={cx('container', open && 'open')}>
      <div className={styles.head}>
        <h1 className={'title'}>우편번호 검색</h1>
        <button onClick={onClose}>
          <CloseIcon fontSize="small" />
        </button>
      </div>

      {open && (
        <DaumPostcode
          onComplete={handleComplete}
          autoClose={false}
          style={{ width: ' 100%', height: '450px' }}
        />
      )}
    </div>
  )
}

export default DaumPostCodeModal
