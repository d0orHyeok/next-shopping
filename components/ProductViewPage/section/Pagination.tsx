import { useEffect, useState } from 'react'
import styles from './Pagination.module.css'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

interface PaginationProps {
  itemNum: number
  displayNum: number
  // 페이지 번호 값을 상위컴포넌트로 전달
  onChange?: (index: number) => void
}

const Pagination = ({ itemNum, displayNum, onChange }: PaginationProps) => {
  const [bullets, setBullets] = useState<number[]>([])
  const [index, setIndex] = useState(1)
  const [page, setPage] = useState(1)

  useEffect(() => {
    setBullets(
      Array.from({ length: Math.ceil(itemNum / displayNum) }, (v, i) => i + 1)
    )
  }, [itemNum])

  useEffect(() => {
    setPage(Math.ceil(index / 5))
    onChange && onChange(index)
  }, [index])

  return (
    <>
      <nav className={styles.pagination}>
        <button className={cx('btn', 'moveBtn')} onClick={() => setIndex(1)}>
          <KeyboardDoubleArrowLeftIcon />
        </button>
        <button
          className={cx('btn', 'moveBtn')}
          onClick={() => index !== 1 && setIndex(index - 1)}
        >
          <KeyboardArrowLeftIcon />
        </button>
        {bullets.map((bullet) => {
          if ((page - 1) * 5 < bullet && bullet <= page * 5) {
            return (
              <button
                className={cx('btn', 'bullet', index === bullet && 'current')}
                key={bullet}
                onClick={() => setIndex(bullet)}
              >
                {bullet}
              </button>
            )
          }
        })}
        <button
          className={cx('btn', 'moveBtn')}
          onClick={() => index !== bullets.length && setIndex(index + 1)}
        >
          <KeyboardArrowRightIcon />
        </button>
        <button
          className={cx('btn', 'moveBtn')}
          onClick={() => setIndex(bullets.length)}
        >
          <KeyboardDoubleArrowRightIcon />
        </button>
      </nav>
    </>
  )
}

export default Pagination
