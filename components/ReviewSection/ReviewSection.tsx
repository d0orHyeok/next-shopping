import styles from './ReviewSection.module.css'
import classNames from 'classnames/bind'
import { IUserState, selectUser } from '@redux/features/userSlice'
import { useAppSelector } from '@redux/hooks'
import React, { useEffect, useState } from 'react'
import Axios from 'axios'
import { IOption } from '@models/User'
import { IReview } from '@models/Review'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import dayjs from 'dayjs'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import EditReviewModal from './section/EditReviewModal'
import UploadImages from '@components/utils/UploadImages/UploadImages'
import Menu from '@mui/material/Menu'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import ReplayIcon from '@mui/icons-material/Replay'

interface IReviewSectionProps {
  style?: React.CSSProperties
  pid: string
  reviews: IReview[]
}

type ISort = 'createdAt' | 'likes' | 'score'
type IFilterName = 'tall' | 'weight' | 'top' | 'bottom'

interface ITempFilter {
  tall: number[]
  weight: number[]
  top: number[]
  bottom: number[]
}

interface IReviewFilter {
  sort: ISort
  filter: ITempFilter
}

interface IAnchorEle {
  tall: null | HTMLElement
  weight: null | HTMLElement
  top: null | HTMLElement
  bottom: null | HTMLElement
}

const cx = classNames.bind(styles)

const ReviewSection = ({ style, pid, reviews }: IReviewSectionProps) => {
  const user: IUserState = useAppSelector(selectUser)

  // 리뷰 등록시 쓰이는 state

  const [writeOpen, setWriteOpen] = useState(false)
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

  // 상품 평점 state
  const [productStars, setProductStars] = useState({
    average: 3,
    num: [0, 0, 0, 0, 0],
    likes: 0,
  })

  // 상품리뷰들 state
  const [productReviews, setProductReviews] = useState<IReview[]>(reviews)

  // 리뷰조회 필터 state
  const [anchorEl, setAnchorEl] = useState<IAnchorEle>({
    tall: null,
    weight: null,
    top: null,
    bottom: null,
  })
  const handleClickFilter =
    (target: IFilterName) => (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl({ ...anchorEl, [target]: event.currentTarget })
      setTempFilter({ ...tempFilter, [target]: reviewFilter.filter[target] })
    }
  const handleCloseFilter = (target: IFilterName) => {
    setAnchorEl({ ...anchorEl, [target]: null })
  }
  const filterArrays = {
    tall: Array.from({ length: 10 }, (_, i) =>
      i === 9 ? (i + 29) * 5 : (i + 30) * 5
    ),
    weight: Array.from({ length: 11 }, (_, i) =>
      i === 10 ? (i + 8) * 5 : (i + 9) * 5
    ),
    top: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    bottom: Array.from({ length: 16 }, (_, i) => i + 23),
  }

  const [tempFilter, setTempFilter] = useState<ITempFilter>({
    tall: [],
    weight: [],
    top: [],
    bottom: [],
  })
  const [reviewFilter, setReviewFilter] = useState<IReviewFilter>({
    sort: 'createdAt',
    filter: { tall: [], weight: [], top: [], bottom: [] },
  })

  // 리뷰 수정 state
  const [openEdit, setOpenEdit] = useState(false)
  const [editReview, setEditReview] = useState<IReview>(reviews[0])

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
    if (!writeOpen) {
      return setWriteOpen(true)
    }

    const tall = parseInt(userSize.tall)
    const weight = parseInt(userSize.weight)
    if (userSize.tall !== '' && (tall < 50 || tall > 300)) {
      return alert('키 (cm)를 바르게 입력해주세요.')
    }
    if (userSize.weight !== '' && (weight < 20 || weight > 300)) {
      return alert('몸무게 (kg)를 바르게 입력해주세요.')
    }
    if (content.length < 5) {
      return alert('5글자 이상의 후기를 입력해주세요.')
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

    if (!confirm('리뷰를 등록하시겠습니까?')) {
      return
    }

    Axios.post('/api/review/add', { review: newReview })
      .then((res) => {
        setWriteOpen(false)
        setProductReviews([
          { ...res.data.review, user_id: { name: user.userData?.name } },
          ...productReviews,
        ])
        return alert('리뷰가 등록되었습니다.')
      })
      .catch((err) => {
        console.log(err)
        return alert('리뷰등록에 실패하였습니다.')
      })
  }

  const handleClickReviewLike = (review_id: string) => {
    if (!user.isLogin) {
      return alert('로그인 후 이용가능합니다.')
    }

    Axios.post('/api/review/toggleLike', { review_id }).then((res) => {
      const newReview: IReview = res.data.review
      setProductReviews(
        productReviews.map((review) =>
          review._id === newReview._id ? newReview : review
        )
      )
    })
  }

  const handleClickReviewDelete = (review_id: string) => {
    if (!user.isLogin) {
      return
    }
    if (!confirm('리뷰를 삭제하시겠습니까?')) {
      return
    }

    Axios.post('/api/review/delete', { review_id, pid })
      .then(() => {
        setProductReviews(
          productReviews.filter((review) => review._id !== review_id)
        )
        return alert('삭제되었습니다.')
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleClickReviewEdit = (review: IReview) => {
    setEditReview(review)
    setOpenEdit(true)
  }

  const successEditReview = (newReview: IReview) => {
    setProductReviews(
      productReviews.map((review) =>
        review._id === newReview._id ? newReview : review
      )
    )
  }

  const handleClickSortOption = (sort: ISort) => {
    setReviewFilter({ ...reviewFilter, sort: sort })
    Axios.post('/api/review/getProductReviews', { pid, sort })
      .then((res) => {
        setProductReviews(res.data.reviews)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleClickReviewFilter = (
    target: IFilterName,
    index: number,
    isChecked: boolean
  ) => {
    setTempFilter({
      ...tempFilter,
      [target]: !isChecked
        ? [...tempFilter[target], index]
        : tempFilter[target].filter((i) => i !== index),
    })
  }

  const handleClickReviewFilterReset = (target: IFilterName) => {
    setTempFilter({ ...tempFilter, [target]: [] })
  }

  const handleClickReviewFilterApply = (target: IFilterName) => {
    if (
      JSON.stringify(tempFilter[target]) ===
      JSON.stringify(reviewFilter.filter[target])
    ) {
      return handleCloseFilter(target)
    }

    const newFilter = { ...reviewFilter.filter, [target]: tempFilter[target] }
    setReviewFilter({
      ...reviewFilter,
      filter: newFilter,
    })
    handleCloseFilter(target)

    let filter: any = {}
    Object.entries(newFilter).map((entrie) => {
      const [label, data] = entrie
      let tempArr: any[] = []
      if (label === 'bottom' || label === 'top') {
        tempArr = data.map((i) => filterArrays[label][i])
      } else if (label === 'tall' || label === 'weight') {
        const filterArray = filterArrays[label]
        data.forEach((i) => {
          if (i === 0) {
            tempArr = [
              ...tempArr,
              ...Array.from({ length: filterArray[i] }, (_, i) => i),
            ]
          } else if (i === filterArray.length - 1) {
            tempArr = [
              ...tempArr,
              ...Array.from(
                { length: 250 - filterArray[i] },
                (_, i) => 249 - i
              ),
            ]
          } else {
            tempArr = [
              ...tempArr,
              ...Array.from(
                { length: filterArray[i] - filterArray[i - 1] },
                (_, n) => filterArray[i] - n - 1
              ),
            ]
          }
        })
      }
      filter =
        tempArr.length !== 0 ? { ...filter, [label]: tempArr } : { ...filter }
    })

    Axios.post('/api/review/getProductReviews', {
      pid,
      sort: reviewFilter.sort,
      filter,
    })
      .then((res) => {
        setProductReviews(res.data.reviews)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    if (user.isLogin && user.userData) {
      Axios.post('/api/payment/getPaymentOption', { pid })
        .then((res) => {
          const { success, option } = res.data

          success && option
            ? setUserPaymentOption(option)
            : setUserPaymentOption(null)
        })
        .catch(() => {
          setUserPaymentOption(null)
        })
    } else {
      setUserPaymentOption(null)
    }
    setScore(5)
    setImages([])
    setProductReviews(reviews)
    setReviewFilter({
      sort: 'createdAt',
      filter: { tall: [], weight: [], top: [], bottom: [] },
    })

    const num = [0, 0, 0, 0, 0]
    let sum = 0
    let likes = 0
    let average = 3

    if (reviews.length) {
      reviews.forEach((review) => {
        sum += review.score
        num[review.score - 1] += 1
        if (review.score >= 3) {
          likes += 1
        }
      })
      average = sum / reviews.length
    }
    setProductStars({ average, likes, num })
  }, [user, pid, reviews])

  return (
    <>
      <div className={cx('wrapper')} style={style}>
        {/* 리뷰작성 */}
        <section className={cx('section-write')}>
          {userPaymentOption ? (
            <>
              <div className={cx('write')}>
                {/* 리뷰 사용자 입력 */}
                <h2 className={cx('write-title')}>REVIEW</h2>
                {!writeOpen ? (
                  <button
                    className={cx('writeBtn')}
                    onClick={() => setWriteOpen(true)}
                  >
                    상품에 대한 후기를 남겨주세요
                  </button>
                ) : (
                  <div className={cx('write-container')}>
                    <div className={cx('write-size')}>
                      <div
                        className={cx('write-size-item', 'write-size-score')}
                      >
                        <span className={cx('label')}>{'만족도'}</span>
                        <div className={cx('write-size-itemStars')}>
                          {Array.from({ length: 5 }, (_, i) => i + 1).map(
                            (i) => (
                              <button
                                key={i}
                                className={cx('starBtn')}
                                onClick={() => setScore(i)}
                              >
                                {score >= i ? <StarIcon /> : <StarBorderIcon />}
                              </button>
                            )
                          )}
                        </div>
                      </div>
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
                          <option value="">
                            {'------ 평소사이즈-상의 ------'}
                          </option>
                          {filterArrays.top.map((top) => (
                            <option key={top} value={top}>
                              {top}
                            </option>
                          ))}
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
                          <option value="">
                            {'------ 평소사이즈-하의 ------'}
                          </option>
                          {filterArrays.bottom.map((bottom) => (
                            <option key={bottom} value={bottom}>
                              {bottom}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div
                        className={cx('write-size-item', 'write-size-option')}
                      >
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
                      className={cx('write-content')}
                      name="content"
                      id="review_content"
                      placeholder="상품에 대한 후기를 남겨주세요"
                      value={content}
                      onChange={(event) => setContent(event.target.value)}
                    ></textarea>
                    <div className={cx('write-images')}>
                      <h2 className={cx('write-images-title')}>사진 첨부</h2>
                      <UploadImages
                        maxNum={3}
                        onChangeHandler={setImages}
                        dropzoneStyle={{ width: '80px', height: '80px' }}
                        imgStyle={{
                          maxWidth: '120px',
                          minWidth: '120px',
                          maxHeight: '180px',
                          minHeight: '180px',
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className={cx('write-select')}>
                  <button
                    className={cx('btn', 'addReviewBtn')}
                    onClick={handleClickAddRevidew}
                  >
                    <AddCircleOutlineIcon />
                    <span>리뷰 등록하기</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </section>
        {/* 상품평점 */}
        <section className={cx('section-score')}>
          <div className={cx('score-container')}>
            <div className={cx('score-total')}>
              <div className={cx('score-total-average')}>
                {productStars.average !== 3
                  ? productStars.average.toFixed(1)
                  : '3.0'}
              </div>
              <span
                className={cx('score-total-num')}
              >{`${reviews.length}개 리뷰 평점`}</span>
            </div>
            <div className={cx('score-stars')}>
              <ul>
                {productStars.num.map((_, index) => (
                  <li key={index}>
                    <span className={cx('score-stars-label')}>
                      {`${5 - index} Stars`}
                    </span>
                    <span className={cx('score-stars-bar')}>
                      <span
                        className={cx('score-stars-barPercent')}
                        style={{
                          width: `${(
                            (productStars.num[4 - index] / reviews.length) *
                            100
                          ).toFixed(0)}%`,
                        }}
                      ></span>
                    </span>
                    <span className={cx('score-stars-num')}>
                      {`(${productStars.num[4 - index]})`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <h3 className={cx('score-desc')}>{`${
            productStars.likes
              ? ((productStars.likes / reviews.length) * 100).toFixed(0)
              : '0'
          }%의 구매자들이 이 상품을 좋아합니다. (${reviews.length}명 중 ${
            productStars.likes
          }명)`}</h3>
        </section>
        {/* 상품리뷰 */}
        <section className={cx('section-reviews')}>
          <div className={cx('reviews-head')}>
            <button
              className={cx(
                'reviewSortBtn',
                reviewFilter.sort === 'createdAt' && 'reviewSortBtn-select'
              )}
              onClick={() => handleClickSortOption('createdAt')}
            >
              최신순
            </button>
            <span className={cx('block')}></span>
            <button
              className={cx(
                'reviewSortBtn',
                reviewFilter.sort === 'likes' && 'reviewSortBtn-select'
              )}
              onClick={() => handleClickSortOption('likes')}
            >
              추천순
            </button>
            <span className={cx('block')}></span>
            <button
              className={cx(
                'reviewSortBtn',
                reviewFilter.sort === 'score' && 'reviewSortBtn-select'
              )}
              onClick={() => handleClickSortOption('score')}
            >
              평점순
            </button>
          </div>
          <div className={cx('reviews-filter')}>
            <button
              className={cx(
                'btn',
                'filterBtn',
                Boolean(anchorEl.tall) && 'filterBtn-active'
              )}
              onClick={handleClickFilter('tall')}
            >
              키<KeyboardArrowDownIcon />
            </button>
            <button
              className={cx(
                'btn',
                'filterBtn',
                Boolean(anchorEl.weight) && 'filterBtn-active'
              )}
              onClick={handleClickFilter('weight')}
            >
              몸무게
              <KeyboardArrowDownIcon />
            </button>
            <button
              className={cx(
                'btn',
                'filterBtn',
                Boolean(anchorEl.top) && 'filterBtn-active'
              )}
              onClick={handleClickFilter('top')}
            >
              평소사이즈-상의
              <KeyboardArrowDownIcon />
            </button>
            <button
              className={cx(
                'btn',
                'filterBtn',
                Boolean(anchorEl.bottom) && 'filterBtn-active'
              )}
              onClick={handleClickFilter('bottom')}
            >
              평소사이즈-하의
              <KeyboardArrowDownIcon />
            </button>
            {Object.keys(tempFilter).map((filterName: IFilterName) => {
              return (
                <Menu
                  key={filterName}
                  id={`filter_${filterName}`}
                  disableScrollLock
                  anchorEl={anchorEl[filterName]}
                  open={Boolean(anchorEl[filterName])}
                  onClose={() => handleCloseFilter(filterName)}
                >
                  <div className={cx('filter-container')}>
                    <div className={cx('filter-head')}>
                      <h3 className={cx('filter-head-title')}>키</h3>
                      <button
                        className={cx('filterResetBtn')}
                        onClick={() => handleClickReviewFilterReset(filterName)}
                      >
                        초기화
                        <ReplayIcon />
                      </button>
                    </div>
                    <div className={cx('filter-main')}>
                      {filterArrays[filterName].map((data, index) => {
                        let text = ''
                        if (filterName === 'tall' && typeof data === 'number') {
                          text = !index
                            ? `${data - 1}cm 이하`
                            : index === filterArrays[filterName].length - 1
                            ? `${data}cm 이상`
                            : `${filterArrays[filterName][index - 1]}cm - ${
                                data - 1
                              }cm`
                        } else if (
                          filterName === 'weight' &&
                          typeof data === 'number'
                        ) {
                          text = !index
                            ? `${data - 1}kg 이하`
                            : index < filterArrays[filterName].length - 1
                            ? `${filterArrays[filterName][index - 1]}kg - ${
                                data - 1
                              }kg`
                            : `${data}kg 이상`
                        } else {
                          text = data.toString()
                        }

                        return (
                          <button
                            key={data}
                            className={cx(
                              'filterItemBtn',
                              `filterItemBtn-${filterName}`,
                              tempFilter[filterName].includes(index) &&
                                'filterItemBtn-checked'
                            )}
                            onClick={() =>
                              handleClickReviewFilter(
                                filterName,
                                index,
                                tempFilter[filterName].includes(index)
                              )
                            }
                          >
                            {text}
                          </button>
                        )
                      })}
                    </div>
                    <div className={cx('filter-apply')}>
                      <button
                        className={cx('filterApplyBtn')}
                        onClick={() => handleClickReviewFilterApply(filterName)}
                      >
                        적용
                      </button>
                    </div>
                  </div>
                </Menu>
              )
            })}
          </div>
          <div className={cx('reviews-list')}>
            {productReviews.map((review, index) => (
              <div key={index} className={cx('reviews-list-review')}>
                <div className={cx('review-main')}>
                  <h3 className={cx('review-main-head')}>
                    <span className={cx('review-main-score')}>
                      {Array.from({ length: 5 }, (_, i) => i + 1).map((i) => {
                        return review.score >= i ? (
                          <StarIcon key={i} />
                        ) : (
                          <StarBorderIcon key={i} />
                        )
                      })}
                    </span>
                    <span className={cx('review-main-createdAt')}>
                      {dayjs(review.createdAt).format('YYYY.MM.DD')}
                    </span>
                  </h3>
                  <p className={cx('review-main-content')}>{review.content}</p>
                  {review.images.length ? (
                    <div className={cx('review-main-imgContainer')}>
                      {review.images.map((image, imageIndex) => (
                        <div key={imageIndex} className={cx('imgBox')}>
                          <img loading="lazy" src={image} alt="reviewImg" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <></>
                  )}

                  <div className={cx('review-main-edit')}>
                    <button
                      className={cx('reviewLikeBtn')}
                      onClick={() => handleClickReviewLike(review._id)}
                    >
                      {!user.isLogin ||
                      review.likes.findIndex(
                        (uid) => uid === user.userData?._id
                      ) === -1 ? (
                        <ThumbUpOffAltIcon />
                      ) : (
                        <ThumbUpAltIcon />
                      )}
                      {`도움돼요 ${
                        review.likes.length ? review.likes.length : ''
                      }`}
                    </button>
                    {user.userData && user.userData._id === review.user_id._id && (
                      <>
                        <span className={cx('block')}></span>
                        <button
                          className={cx('reviewEditBtn')}
                          onClick={() => handleClickReviewEdit(review)}
                        >
                          수정
                        </button>
                        <button
                          className={cx('reviewDeleteBtn')}
                          onClick={() => handleClickReviewDelete(review._id)}
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <ul className={cx('review-desc')}>
                  <li className={cx('review-desc-writer')}>
                    {`${review.user_id.name}님의 리뷰입니다.`}
                  </li>
                  {Object.entries(review.user_size).map((entrie, index) => {
                    let label = ''
                    const data = entrie[1]

                    if (!data || data === '') {
                      return <></>
                    }
                    if (entrie[0] === 'tall') {
                      label = '키'
                      data + 'cm'
                    } else if (entrie[0] === 'weight') {
                      label = '몸무게'
                      data + 'kg'
                    } else if (entrie[0] === 'top') {
                      label = '평소사이즈-상의'
                    } else {
                      label = '평소사이즈-하의'
                    }

                    return (
                      <li key={index} className={cx('review-desc-size')}>
                        <span className={cx('review-desc-size_sizeLabel')}>
                          {label}
                        </span>
                        <span className={cx('review-desc-size_sizeData')}>
                          {data}
                        </span>
                      </li>
                    )
                  })}
                  <li className={cx('review-desc-size')}>
                    <span className={cx('review-desc-size_sizeLabel')}>
                      Color
                    </span>
                    <span className={cx('review-desc-size_sizeData')}>
                      {review.option.color.colorName}
                    </span>
                  </li>
                  <li className={cx('review-desc-size')}>
                    <span className={cx('review-desc-size_sizeLabel')}>
                      Size
                    </span>
                    <span className={cx('review-desc-size_sizeData')}>
                      {review.option.size}
                    </span>
                  </li>
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
      {productReviews.length ? (
        <EditReviewModal
          review={editReview}
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          onSubmit={successEditReview}
        />
      ) : (
        <></>
      )}
    </>
  )
}

export default ReviewSection
