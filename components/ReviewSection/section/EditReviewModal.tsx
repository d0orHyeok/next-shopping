import styles from './EditReviewModal.module.css'
import classNames from 'classnames/bind'
import Modal from '@mui/material/Modal'
import CloseIcon from '@mui/icons-material/Close'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import { useEffect, useState } from 'react'
import { IReview } from '@models/Review'
import Axios from 'axios'
import UploadImages from '@components/utils/UploadImages/UploadImages'

interface IEditReviewModalProps {
  review: IReview
  open: boolean
  onClose: () => void
  onSubmit: (newReview: IReview) => void
}

const cx = classNames.bind(styles)

const EditReviewModal = ({
  review,
  open,
  onClose,
  onSubmit,
}: IEditReviewModalProps) => {
  const filterTopArray = ['XS', 'S', 'M', 'L', 'XL', '2XL']
  const filterBottomArray = Array.from({ length: 16 }, (_, i) => i + 23)

  const [score, setScore] = useState(5)
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [userSize, setUserSize] = useState({
    tall: '',
    weight: '',
    top: '',
    bottom: '',
  })

  useEffect(() => {
    setScore(review.score)
    setContent(review.content)
    setUserSize(review.user_size)
    setImages(review.images)
  }, [review, open])

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
    if (content.length < 5) {
      return alert('5글자 이상의 후기를 입력해주세요.')
    }
    if (userSize.tall !== '' && (tall < 50 || tall > 300)) {
      return alert('키 (cm)를 바르게 입력해주세요.')
    }
    if (userSize.weight !== '' && (weight < 20 || weight > 300)) {
      return alert('몸무게 (kg)를 바르게 입력해주세요.')
    }

    if (
      review.content === content &&
      review.score === score &&
      JSON.stringify(review.images) === JSON.stringify(images) &&
      JSON.stringify(review.user_size) === JSON.stringify(userSize)
    ) {
      onClose()
      return
    }

    if (!confirm('리뷰를 수정하시겠습니까?')) {
      return
    }

    Axios.post('/api/review/edit', {
      review_id: review._id,
      update: { score, images, content, user_size: userSize },
    })
      .then((res) => {
        const editReview: IReview = res.data.editReview
        onSubmit(editReview)
        onClose()
        return
      })
      .catch((err) => {
        console.log(err)
        alert('리뷰 수정에 실패하였습니다.')
        onClose()
        return
      })
  }

  return (
    <>
      <Modal open={open} onClose={onClose} disableScrollLock hideBackdrop>
        <div className={cx('container')}>
          <head className={cx('head')}>
            <h1 className={cx('title')}>리뷰 수정</h1>
            <button className={cx('closeBtn')} onClick={onClose}>
              <CloseIcon />
            </button>
          </head>
          <main className={cx('main')}>
            <div className={cx('option')}>
              <h2 className={cx('subTitle')}>선택한 옵션</h2>
              <div className={cx('option-item')}>
                <span className={cx('label')}>Color</span>
                {review.option.color.colorName}
              </div>
              <div className={cx('option-item')}>
                <span className={cx('label')}>Size</span>
                {review.option.size}
              </div>
            </div>
            <div className={cx('score')}>
              <h2 className={cx('subTitle')}>만족도</h2>
              {Array.from({ length: 5 }, (_, i) => i + 1).map((i) => (
                <button
                  className={cx('starBtn')}
                  key={i}
                  onClick={() => setScore(i)}
                >
                  {score >= i ? <StarIcon /> : <StarBorderIcon />}
                </button>
              ))}
            </div>
            <div className={cx('content')}>
              <h2 className={cx('subTitle')}>리뷰 작성</h2>
              <textarea
                name="content"
                id="content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
              ></textarea>
            </div>
            <div className={cx('images')}>
              <h2 className={cx('subTitle')}>사진첨부</h2>
              <div>
                <UploadImages
                  defaultImages={images}
                  maxNum={3}
                  onChangeHandler={setImages}
                  dropzoneStyle={{ width: '50px', height: '50px' }}
                  imgStyle={{
                    minWidth: '80px',
                    minHeight: '120px',
                    maxWidth: '80px',
                    maxHeight: '120px',
                  }}
                />
              </div>
            </div>
            <div className={cx('sizes')}>
              <h2 className={cx('subTitle')}>키</h2>
              <input
                type="text"
                id="tall"
                value={userSize.tall}
                onChange={handleChangeInput}
              />
              <h2 className={cx('subTitle')}>몸무게</h2>
              <input
                type="text"
                id="weight"
                value={userSize.weight}
                onChange={handleChangeInput}
              />
              <h2 className={cx('subTitle')}>평소사이즈 - 상의</h2>
              <select
                name="userSize"
                id="top"
                value={userSize.top}
                onChange={handleChangeSelect}
              >
                <option value="">{'------ 평소사이즈-상의 ------'}</option>
                {filterTopArray.map((top) => (
                  <option key={top} value={top}>
                    {top}
                  </option>
                ))}
              </select>
              <h2 className={cx('subTitle')}>평소사이즈 - 하의</h2>
              <select
                name="userSize"
                id="bottom"
                value={userSize.bottom}
                onChange={handleChangeSelect}
              >
                <option value="">{'------ 평소사이즈-하의 ------'}</option>
                {filterBottomArray.map((bottom) => (
                  <option key={bottom} value={bottom}>
                    {bottom}
                  </option>
                ))}
              </select>
            </div>
          </main>
          <div className={cx('controls')}>
            <button className={cx('editBtn')} onClick={handleClickAddRevidew}>
              수정
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default EditReviewModal
