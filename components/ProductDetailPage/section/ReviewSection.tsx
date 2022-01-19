import styles from './ReviewSection.module.css'
import classNames from 'classnames/bind'
import { IUserState, selectUser } from '@redux/features/userSlice'
import { useAppSelector } from '@redux/hooks'
import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { IOption } from '@models/User'

interface IReviewSectionProps {
  className?: string
  style?: React.CSSProperties
  pid: string
}

const cx = classNames.bind(styles)

const ReviewSection = ({ className, style, pid }: IReviewSectionProps) => {
  const user: IUserState = useAppSelector(selectUser)

  const [userPaymentOption, setUserPaymentOption] = useState<null | IOption>(
    null
  )
  const [userSize, setUserSize] = useState({
    tall: '',
    weight: '',
    top: '',
    bottom: '',
  })
  const [score, setScore] = useState(5)
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])

  const handleChangeInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const numRegex = /[\d]/gi
    const { id, value } = event.target
    if (numRegex.test(value) || value.length === 0)
      setUserSize({ ...userSize, [id]: value })
  }

  const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = event.target
    setUserSize({ ...userSize, [id]: value })
  }

  const handleClickAddRevidew = () => {
    const tall = parseInt(userSize.tall)
    const weight = parseInt(userSize.weight)
    if (tall < 50 || tall > 300) {
      return alert('키 (cm)를 바르게 입력해주세요.')
    }
    if (weight < 20 || weight > 300) {
      return alert('몸무게 (kg)를 바르게 입력해주세요.')
    }
    if (userSize.top === '') {
      return alert('평소 상의사이즈를 선택해주세요.')
    }
    if (userSize.bottom === '') {
      return alert('평소 하의사이즈를 선택해주세요.')
    }
    if (content.length < 3) {
      return alert('2글자 이상의 후기를 입력해주세요.')
    }

    const newReview = {
      user_id: user.userData?._id,
      pid,
      score,
      images,
      content,
      option: userPaymentOption,
      user_size: userSize,
    }

    Axios.post('/api/review/add', { review: newReview })
      .then((res) => {
        console.log(res.data)
        return alert('리뷰가 등록되었습니다.')
      })
      .catch((err) => {
        console.log(err)
        return alert('리뷰등록에 실패하였습니다.')
      })
  }

  useEffect(() => {
    if (user.isLogin && user.userData) {
      Axios.post('/api/payment/getPaymentOption', { pid }).then((res) => {
        const { success, option } = res.data

        success && option
          ? setUserPaymentOption(option)
          : setUserPaymentOption(null)
      })
    } else {
      setUserPaymentOption(null)
    }
  }, [user, pid])

  return (
    <section className={className && className} style={style}>
      {userPaymentOption ? (
        <div className={cx('write')}>
          <h2 className={cx('write-title')}>REVIEW</h2>
          <button>상품에 대한 후기를 남겨주세요</button>
          {/* 리뷰 사용자 입력 */}
          <div className={cx('write-container')}>
            <div className={cx('write-size')}>
              <div className={cx('write-size-item')}>
                <span className={cx('label')}>{'키 (cm)'}</span>
                <input
                  type="text"
                  id="tall"
                  className={cx('input')}
                  value={userSize.tall}
                  onChange={handleChangeInput}
                />
              </div>
              <div className={cx('write-size-item')}>
                <span className={cx('label')}>{'몸무게 (kg)'}</span>
                <input
                  type="text"
                  id="weight"
                  className={cx('input')}
                  value={userSize.weight}
                  onChange={handleChangeInput}
                />
              </div>
              <div className={cx('write-size-item')}>
                <span className={cx('label')}>{'평소사이즈-상의'}</span>
                <select
                  name="userSize"
                  id="top"
                  value={userSize.top}
                  onChange={handleChangeSelect}
                >
                  <option value="">{'------ 평소사이즈-상의 ------'}</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                  <option value="2XL">2XL</option>
                </select>
              </div>
              <div className={cx('write-size-item')}>
                <span className={cx('label')}>{'평소사이즈-하의'}</span>
                <select
                  name="userSize"
                  id="bottom"
                  value={userSize.bottom}
                  onChange={handleChangeSelect}
                >
                  <option value="">{'------ 평소사이즈-하의 ------'}</option>
                  {Array.from({ length: 16 }, (_, i) => i + 23).map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              <div className={cx('write-size-item')}>
                <span className={cx('label')}>{'선택한 옵션'}</span>
                <ul className={cx('paymentOptions')}>
                  <li className={cx('paymentOptions-item')}>
                    <span className={cx('paymentOptions-item-label')}>
                      {'Color:'}
                    </span>
                    <span className={cx('paymentOptions-item-data')}>
                      {userPaymentOption.color.colorName}
                    </span>
                  </li>
                  <li className={cx('paymentOptions-item')}>
                    <span className={cx('paymentOptions-item-label')}>
                      {'Size:'}
                    </span>
                    <span className={cx('paymentOptions-item-data')}>
                      {userPaymentOption.size}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
            <textarea
              className={cx('input', 'textarea', 'write-content')}
              name="content"
              id="review_content"
              placeholder="상품에 대한 후기를 남겨주세요"
              value={content}
              onChange={(event) => setContent(event.target.value)}
            ></textarea>
          </div>
          <div className={cx('write-select')}>
            <button>사진추가</button>
            <select
              name="score"
              id="review_score"
              onChange={(event) => setScore(parseInt(event.target.value))}
            >
              <option value={5}>아주 좋아요</option>
              <option value={4}>맘에 들어요</option>
              <option value={3}>보통이에요</option>
              <option value={2}>그냥 그래요</option>
              <option value={1}>별로에요</option>
            </select>
            <button onClick={handleClickAddRevidew}>리뷰 등록하기</button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </section>
  )
}

export default ReviewSection
