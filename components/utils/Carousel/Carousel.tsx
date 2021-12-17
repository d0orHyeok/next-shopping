import styles from './Carousel.module.css'
import classnames from 'classnames/bind'
const cx = classnames.bind(styles)
import { useEffect, useRef, useState, useCallback } from 'react'
import { debounce } from 'lodash'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

interface CarouselProps {
  autoPlay: boolean
  children?: React.ReactNode
  backgroundColor?: string
  btnColor?: string
  m?: string
}

const Carousel = ({
  autoPlay = false,
  children,
  backgroundColor = 'white',
  btnColor = 'lightgray',
  m = '0 0.5rem',
}: CarouselProps) => {
  const slideRef = useRef<HTMLUListElement>(null)
  const [slideWidth, setSlideWidth] = useState(0)
  const itemRef = useRef<HTMLLIElement>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const items = Array.isArray(children) ? children : [children, children]

  const moveScroll = useCallback(
    (index: number, preventAnimation = false) => {
      if (slideRef.current !== null && itemRef.current !== null) {
        preventAnimation
          ? (slideRef.current.style.transition = 'all 0s')
          : (slideRef.current.style.transition = 'all 0.5s ease-in-out')

        const width = itemRef.current.offsetWidth
        const move = width * index

        slideRef.current.style.transform = `translateX(-${move}px)`
      }
    },
    [slideRef.current?.offsetWidth]
  )

  const changeIndex = useCallback(
    (direction: 'prev' | 'next') => {
      const move = direction === 'prev' ? -1 : 1
      let value = selectedIndex + move
      if (value === -1) {
        value = items.length + move
        moveScroll(value + 2, true)
      }
      if (value === items.length) {
        value = 0
        moveScroll(value, true)
      }
      return value
    },
    [selectedIndex]
  )

  // 화면 가로 변화 인식
  const handleResize = debounce(() => {
    slideRef.current !== null && setSlideWidth(slideRef.current.offsetWidth)
  }, 200)

  const isDisplayThree = useCallback(() => {
    if (
      slideRef.current &&
      itemRef.current &&
      slideRef.current.offsetWidth <= itemRef.current.offsetWidth * 2 + 1
    ) {
      return false
    } else {
      return true
    }
  }, [itemRef, slideRef])

  useEffect(() => {
    if (slideRef.current !== null) {
      window.addEventListener('resize', handleResize)
    }
    return window.addEventListener('resize', handleResize)
  }, [slideRef.current?.offsetWidth])

  // autoPlay 옵션을 위해 시간 변화인식
  const [time, setTime] = useState(false)
  useEffect(() => {
    if (autoPlay) {
      const autoplay = setTimeout(() => {
        setSelectedIndex(changeIndex('next'))
        setTime(!time)
      }, 12000)
      return () => clearTimeout(autoplay)
    }
  }, [time, selectedIndex])

  useEffect(() => {
    moveScroll(selectedIndex + 1, true)
    return moveScroll(selectedIndex + 1)
  }, [selectedIndex, slideWidth])

  return (
    <>
      <div
        className={styles.carousel}
        style={{ backgroundColor: backgroundColor }}
      >
        <ul ref={slideRef} className={cx('carousel-wrapper')}>
          {/* dummy for infinite carousel */}

          {items.length > 2 && isDisplayThree() && (
            <li style={{ padding: m }} className={cx('carousel-item')}>
              {items[items.length - 2]}
            </li>
          )}
          <li style={{ padding: m }} className={cx('carousel-item')}>
            {items[items.length - 1]}
          </li>

          <li
            style={{ padding: m }}
            ref={itemRef}
            className={cx('carousel-item', 'carousel-item-next')}
          >
            {items[0]}
          </li>
          <li
            style={{ padding: m }}
            className={cx('carousel-item', 'carousel-item-next')}
          >
            {items[1]}
          </li>
          {/* carousel area */}
          {items.map((item, index) => (
            <li
              style={{ padding: m }}
              key={index}
              className={cx(
                'carousel-item',
                index === selectedIndex && 'carousel-item-selected'
              )}
            >
              {item}
            </li>
          ))}
        </ul>
        {/* pagination area */}
        <div className={cx('pagination')}>
          {items.map((_, index) => (
            <span
              key={index}
              className={cx(
                'pagination-bullet',
                index === selectedIndex && 'pagination-bullet-selected'
              )}
              onClick={() => setSelectedIndex(index)}
            ></span>
          ))}
        </div>
        {/* btn */}
        <span
          className={cx('carouselBtn', 'prevBtn')}
          onClick={() => setSelectedIndex(changeIndex('prev'))}
          style={{ color: btnColor }}
        >
          <ArrowBackIosNewIcon />
        </span>
        <span
          className={cx('carouselBtn', 'nextBtn')}
          onClick={() => setSelectedIndex(changeIndex('next'))}
          style={{ color: btnColor }}
        >
          <ArrowForwardIosIcon />
        </span>
      </div>
    </>
  )
}

export default Carousel
