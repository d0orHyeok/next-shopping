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
      {/* ???????????? ?????? */}
      <section className={cx('select')}>
        {/* ?????? */}
        <nav className={cx('select-history')}>
          <Link href={{ pathname: '/user/mypage/history' }}>
            <a
              className={cx(
                'btn',
                'historyBtn',
                mode === 'order' && 'historyBtn-select'
              )}
            >
              ??????????????????
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
              ??????/??????/?????? ??????
            </a>
          </Link>
          <span className={cx('select-history-blank')}></span>
        </nav>
        {/* ???????????? ?????? */}
        <div className={cx('select-order')}>
          {/* ?????? */}
          <div className={cx('select-order-filter')}>
            <div className={cx('filter-state')}>
              <select
                name="orderState"
                id="orderState"
                value={orderState}
                onChange={handleChangeOrderState}
              >
                <option value="">??????????????????</option>
                {mode === 'order' ? (
                  <>
                    <option value="ready">???????????????</option>
                    <option value="delivery">?????????</option>
                    <option value="complete">????????????</option>
                  </>
                ) : (
                  <>
                    <option value="cancel">??????</option>
                    <option value="change">??????</option>
                    <option value="back">??????</option>
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
                ??????
              </button>
              <button
                className={cx('btn', 'periodBtn')}
                value="week"
                onClick={handleClickPeriod}
              >
                1??????
              </button>
              <button
                className={cx('btn', 'periodBtn')}
                value="month"
                onClick={handleClickPeriod}
              >
                1??????
              </button>
              <button
                className={cx('btn', 'periodBtn')}
                value="season"
                onClick={handleClickPeriod}
              >
                3??????
              </button>
              <button
                className={cx('btn', 'periodBtn')}
                value="halfYear"
                onClick={handleClickPeriod}
              >
                6??????
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
                ??????
              </button>
            </div>
          </div>
          {/* ???????????? ?????? */}
          <div className={cx('select-order-desc')}>
            <ol>
              <li>??????????????? ?????? 3???????????? ????????? ???????????????.</li>
              <li>
                ??????????????? ??????????????? ?????? ????????? ?????? ??????????????? ???????????? ???
                ????????????.
              </li>
              <li>
                ????????? ?????? ???????????? ??????????????? ??????????????? ??? ??? ????????????.
              </li>
              <li>
                ??????/??????/?????? ????????? ??????????????? ???????????? 7????????? ???????????????.{' '}
                {'(?????? ???????????? ???????????? ?????? ??????????????? ???????????????.)'}
              </li>
            </ol>
          </div>
        </div>
      </section>
      <section className={cx('orderList')}>
        <h1 className={cx('title', 'underline')}>?????? ?????? ??????</h1>
        <PaymentOrderTable payments={payments} />
      </section>
    </div>
  )
}

export default HistoryPage
