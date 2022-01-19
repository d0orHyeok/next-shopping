import styles from './HistoryPage.module.css'
import classNames from 'classnames/bind'

import Link from 'next/link'
import React, { useState } from 'react'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { IPayment } from '@models/Payment'
import PaymentOrderTable from '../section/PaymentOrderTable'

export interface IHistoryPageProps {
  payments: IPayment[]
  mode: 'order' | 'refund'
  order_state: string
  date_start: string
  date_end: string
}

const cx = classNames.bind(styles)
const today = dayjs(Date.now())

const HistoryPage = ({
  payments,
  mode,
  order_state,
  date_start,
  date_end,
}: IHistoryPageProps) => {
  const router = useRouter()

  const [orderState, setOrderState] = useState(order_state)
  const [date, setDate] = useState({ dateStart: date_start, dateEnd: date_end })

  const { dateStart, dateEnd } = date

  const handleChangeOrderState = (
    evnet: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = evnet.target
    setOrderState(value)
  }

  const handleChangeDate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, id } = event.target
    setDate({ ...date, [id]: value })
  }

  const handleClickPeriod = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { value } = event.currentTarget

    let start = ''
    switch (value) {
      case 'today':
        start = today.format('YYYY-MM-DD')
        break
      case 'week':
        start = today.subtract(1, 'week').format('YYYY-MM-DD')
        break
      case 'month':
        start = today.subtract(1, 'month').format('YYYY-MM-DD')
        break
      case 'season':
        start = today.subtract(3, 'month').format('YYYY-MM-DD')
        break
      case 'halfYear':
        start = today.subtract(6, 'month').format('YYYY-MM-DD')
        break
    }
    setDate({ dateStart: start, dateEnd: today.format('YYYY-MM-DD') })
  }

  const handleClickView = () => {
    router.push({
      pathname: '/user/mypage/history',
      query: {
        ...router.query,
        date_start: dateStart,
        date_end: dateEnd,
        order_state: orderState,
      },
    })
  }

  return (
    <div className={cx('wrapper')}>
      {/* 주문조회 선택 */}
      <section className={cx('select')}>
        {/* 버튼 */}
        <nav className={cx('select-history')}>
          <Link href={{ pathname: '/user/mypage/history' }}>
            <a
              className={cx(
                'btn',
                'historyBtn',
                mode === 'order' && 'historyBtn-select'
              )}
            >
              주문내역조회
            </a>
          </Link>
          <Link
            href={{
              pathname: '/user/mypage/history',
              query: { mode: 'refund' },
            }}
          >
            <a
              className={cx(
                'btn',
                'historyBtn',
                mode === 'refund' && 'historyBtn-select'
              )}
            >
              취소/교환/반품 내역
            </a>
          </Link>
          <span className={cx('select-history-blank')}></span>
        </nav>
        {/* 주문조회 필터 */}
        <div className={cx('select-order')}>
          {/* 필터 */}
          <div className={cx('select-order-filter')}>
            <div className={cx('filter-state')}>
              <select
                name="orderState"
                id="orderState"
                value={orderState}
                onChange={handleChangeOrderState}
              >
                <option value="">주문처리상태</option>
                {mode === 'order' ? (
                  <>
                    <option value="ready">상품준비중</option>
                    <option value="delivery">배송중</option>
                    <option value="complete">배송완료</option>
                  </>
                ) : (
                  <>
                    <option value="cancel">취소</option>
                    <option value="change">교환</option>
                    <option value="back">반품</option>
                  </>
                )}
              </select>
            </div>
            <div className={cx('filter-period')}>
              <button
                className={cx('btn', 'periodBtn')}
                value="today"
                onClick={handleClickPeriod}
              >
                오늘
              </button>
              <button
                className={cx('btn', 'periodBtn')}
                value="week"
                onClick={handleClickPeriod}
              >
                1주일
              </button>
              <button
                className={cx('btn', 'periodBtn')}
                value="month"
                onClick={handleClickPeriod}
              >
                1개월
              </button>
              <button
                className={cx('btn', 'periodBtn')}
                value="season"
                onClick={handleClickPeriod}
              >
                3개월
              </button>
              <button
                className={cx('btn', 'periodBtn')}
                value="halfYear"
                onClick={handleClickPeriod}
              >
                6개월
              </button>
            </div>
            <div className={cx('filter-datePicker')}>
              <input
                className={cx('datePicker', 'dateStart')}
                type="date"
                id="dateStart"
                min={today.subtract(2, 'year').format('YYYY-MM-DD')}
                max={today.format('YYYY-MM-DD')}
                value={dateStart}
                onChange={handleChangeDate}
              />
              <span>~</span>
              <input
                className={cx('datePicker', 'dateEnd')}
                type="date"
                id="dateEnd"
                min={today.subtract(2, 'year').format('YYYY-MM-DD')}
                max={today.format('YYYY-MM-DD')}
                value={dateEnd}
                onChange={handleChangeDate}
              />
              <button
                className={cx('btn', 'dateBtn')}
                onClick={handleClickView}
              >
                조회
              </button>
            </div>
          </div>
          {/* 주문조회 설명 */}
          <div className={cx('select-order-desc')}>
            <ol>
              <li>기본적으로 최근 3개월간의 자료가 조회됩니다.</li>
              <li>
                주문번호를 클릭하시면 해당 주문에 대한 상세내역을 확인하실 수
                있습니다.
              </li>
              <li>
                취소/교환/반품 신청은 배송완료일 기준으로 7일까지 가능합니다.
              </li>
            </ol>
          </div>
        </div>
      </section>
      <section className={cx('orderList')}>
        <h1 className={cx('title', 'underline')}>주문 상품 정보</h1>
        <PaymentOrderTable payments={payments} />
      </section>
    </div>
  )
}

export default HistoryPage
