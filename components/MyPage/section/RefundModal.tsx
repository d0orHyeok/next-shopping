import styles from './RefundModal.module.css'
import classNames from 'classnames/bind'
import Modal from '@mui/material/Modal'
import CloseIcon from '@mui/icons-material/Close'
import { IPayment } from '@models/Payment'
import Axios from 'axios'
import { useState, useEffect } from 'react'

interface IRefundModalProps {
  payment: IPayment
  open: boolean
  onClose: () => void
}

const cx = classNames.bind(styles)

const RefundModal = ({ payment, open, onClose }: IRefundModalProps) => {
  const [reason, setReason] = useState('')

  const requestRefund = () => {
    if (!confirm('환불을 진행하시겠습니까?')) {
      return alert('취소되었습니다.')
    }

    Axios.post('/api/payment/refund', {
      payment_id: payment._id,
      refund_reason: reason,
    })
      .then(() => {
        alert('환불되었습니다.')
        onClose()
        window.location.reload()
      })
      .catch((err) => {
        alert(
          err.response.data.message ? err.response.data.message : '환불 실패'
        )
        return onClose()
      })
  }

  useEffect(() => {
    setReason('')
  }, [open])

  return (
    <>
      <Modal open={open} onClose={onClose} disableScrollLock>
        <div className={cx('container')}>
          <head className={cx('head')}>
            <h1 className={cx('title')}>환불 신청</h1>
            <button className={cx('closeBtn')} onClick={onClose}>
              <CloseIcon />
            </button>
          </head>
          <main className={cx('main')}>
            <div className={cx('paymentInfo')}>
              <h2 className={cx('subTitle')}>결제수단</h2>
              <span className={cx('paymentInfo-data')}>
                {payment.method_name}
              </span>
              <h2 className={cx('subTitle')}>결제정보</h2>
              <span
                className={cx('paymentInfo-data')}
              >{`${payment.card_name} ${payment.card_no}`}</span>
            </div>
            <div className={cx('refundMethod')}>
              <h2 className={cx('subTitle')}>환불 방법</h2>
              <input type="radio" id="refund_all" name="refund_type" checked />
              <label htmlFor="refund_all">전체환불</label>

              <h2 className={cx('subTitle')}>환불 종류</h2>
              <select name="refund_state" id="refund_state" value="cancel">
                <option value="cancel">취소</option>
                <option value="change">교환</option>
                <option value="back">반품</option>
              </select>

              <h2 className={cx('subTitle')}>환불 사유</h2>
              <input
                type="text"
                className={cx('input-reason')}
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
            </div>
            <div className={cx('desc')}>
              <ul>
                <li>
                  PIIC 사이트 환불은 항상 전체 환불로 진행되며 테스트 결제 후
                  자동 환불되지 않은 상품에 대해서 환불이 진행됩니다.
                </li>
              </ul>
            </div>
          </main>
          <div className={cx('controls')}>
            <button className={cx('editBtn')} onClick={requestRefund}>
              환불신청
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default RefundModal
