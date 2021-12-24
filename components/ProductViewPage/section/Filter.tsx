import styles from './Filter.module.css'
import { Divider } from '@mui/material'
import { IFilterOptions } from '@api/product/getFilterOptions'
import React, { useEffect, useState } from 'react'
import className from 'classnames/bind'
import { useRouter } from 'next/router'
const cx = className.bind(styles)

interface IFilterProps {
  filterOptions: IFilterOptions
}

const Filter = ({ filterOptions }: IFilterProps) => {
  const router = useRouter()
  const { colorOptions, fitOptions, seasonOptions } = filterOptions

  const [colorSelect, setColorSelect] = useState(colorOptions.map((_) => false))
  const [fitSelect, setFitSelect] = useState(-1)
  const [seasonSelect, setSeasonSelect] = useState(
    seasonOptions.map((_) => false)
  )

  const handleColorClick = (selectIndex: number) => {
    const newHex: string[] = []

    colorOptions.forEach((option, index) => {
      if (index === selectIndex) {
        !colorSelect[index] && newHex.push(option.colorHex)
      } else {
        colorSelect[index] && newHex.push(option.colorHex)
      }
    })

    const href = {
      pathname: router.pathname,
      query: { ...router.query, colors: newHex },
    }
    router.push(href)
  }

  const handleFitClick = (selectIndex: number) => {
    let newFit: string | null = null
    if (selectIndex !== fitSelect) {
      newFit = fitOptions[selectIndex]
    }
    const href = {
      pathname: router.pathname,
      query: { ...router.query, fit: newFit },
    }
    router.push(href)
  }

  const handleSeasonClick = (selectIndex: number) => {
    const newSeason: string[] = []

    seasonOptions.forEach((option, index) => {
      if (index === selectIndex) {
        !seasonSelect[index] && newSeason.push(option)
      } else {
        seasonSelect[index] && newSeason.push(option)
      }
    })

    const href = {
      pathname: router.pathname,
      query: { ...router.query, season: newSeason },
    }
    router.push(href)
  }

  //  filter 선택으로 query 변경 시 선택된 필터 확인
  useEffect(() => {
    const { colors, fit, season } = router.query

    // 색상
    if (colors) {
      setColorSelect(
        colorOptions.map(
          (color) => colors.toString().indexOf(color.colorHex) !== -1
        )
      )
    } else {
      setColorSelect(colorOptions.map((_) => false))
    }

    // 핏
    fit
      ? fitOptions.forEach((item, index) => {
          if (item === fit) {
            setFitSelect(index)
          }
        })
      : setFitSelect(-1)

    // 계절
    if (season) {
      setSeasonSelect(
        seasonOptions.map((s) => season.toString().indexOf(s) !== -1)
      )
    } else {
      setSeasonSelect(seasonOptions.map((_) => false))
    }
  }, [router.asPath])

  return (
    <>
      <div className={styles.wrapper}>
        {colorOptions && (
          <>
            <h1 className={styles.filterLabel}>색상</h1>
            <div className={styles.colorBox}>
              {colorOptions.map((color, index) => (
                <span
                  className={cx(
                    'colorItem',
                    colorSelect[index] && 'colorSelect'
                  )}
                  key={index}
                  style={{ backgroundColor: color.colorHex }}
                  data-label={color.colorName}
                  onClick={() => handleColorClick(index)}
                ></span>
              ))}
            </div>
            <Divider sx={{ margin: '2rem 0' }} />
          </>
        )}
        {fitOptions && (
          <>
            <h1 className={styles.filterLabel}>핏</h1>
            <div className={styles.btnBox}>
              {fitOptions.map((fit, index) => (
                <button
                  key={index}
                  className={cx('btnItem', fitSelect === index && 'btnSelect')}
                  onClick={() => handleFitClick(index)}
                >
                  {fit}
                </button>
              ))}
            </div>
            <Divider sx={{ margin: '2rem 0' }} />
          </>
        )}
        {seasonOptions && (
          <>
            <h1 className={styles.filterLabel}>계절</h1>
            <div className={styles.btnBox}>
              {seasonOptions.map((fit, index) => (
                <button
                  key={index}
                  className={cx('btnItem', seasonSelect[index] && 'btnSelect')}
                  onClick={() => handleSeasonClick(index)}
                >
                  {fit}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default Filter
