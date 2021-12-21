import { useEffect, useState } from 'react'
import { Checkbox, FormControlLabel } from '@mui/material'
import styles from '../AddProductPage.module.css'
import sizeData from 'public/data/size.json'

interface SelectSizeProps {
  pSizes?: string[]
  category: string[]
  handleChange: (sizes: string[]) => void
}

const SelectSize = ({ pSizes, category, handleChange }: SelectSizeProps) => {
  const [sizeItems, setSizeItems] = useState<string[]>([]) // 사이즈 정보를 담는다
  const [sizeChecked, setSizeChecked] = useState<boolean[]>([]) // checkbox 정보

  const getSizeItems = () => {
    const newSizeItems = sizeData.filter((item) => item.name === category[0])[0]
    if (newSizeItems) {
      return newSizeItems.sizes
    } else {
      return []
    }
  }

  useEffect(() => {
    // 카테고리에 맞는 사이즈 정보를 설정한다
    const newSizeItems = getSizeItems()

    setSizeItems(newSizeItems)
    const newSizeChecked = newSizeItems.map((_) => false)
    setSizeChecked(newSizeChecked)
  }, [category])

  useEffect(() => {
    if (pSizes) {
      const newChecked = getSizeItems().map(
        (item) => pSizes.find((size) => size === item) !== undefined
      )
      setSizeChecked(newChecked)
    }
  }, [pSizes])

  useEffect(() => {
    // 사이즈가 선택되면 해당 사이즈정보를 반환한다
    const newSizes: string[] = []
    sizeItems.forEach((item, index) => {
      if (sizeChecked[index]) {
        newSizes.push(item)
      }
    })
    handleChange(newSizes)
  }, [sizeChecked])

  const handleChangeAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSizeChecked = sizeChecked.map((_) => event.target.checked)
    setSizeChecked(newSizeChecked)
  }

  const handleChangeChecked = (
    event: React.ChangeEvent<HTMLInputElement>,
    targetIndex: number
  ) => {
    const newSizeChecked = sizeChecked.map((isChecked, index) => {
      if (index === targetIndex) {
        return event.target.checked
      }
      return isChecked
    })
    setSizeChecked(newSizeChecked)
  }

  const childCheckBox = sizeChecked.length ? (
    sizeItems.map((size, index) => (
      <FormControlLabel
        key={index}
        label={size}
        control={
          <Checkbox
            checked={sizeChecked[index]}
            onChange={(event) => handleChangeChecked(event, index)}
          />
        }
      />
    ))
  ) : (
    <></>
  )

  return (
    <>
      <div className={styles.size}>
        {/* Title */}
        <h2 className={styles.subTitle}>사이즈 *</h2>
        {sizeChecked.length ? (
          // 사이즈가
          <FormControlLabel
            label="All"
            control={
              <Checkbox
                checked={
                  sizeChecked.length ===
                  sizeChecked.filter((isChecked) => isChecked === true).length
                }
                indeterminate={
                  sizeChecked.length >
                    sizeChecked.filter((isChecked) => isChecked === true)
                      .length &&
                  0 <
                    sizeChecked.filter((isChecked) => isChecked === true).length
                }
                onChange={handleChangeAll}
              />
            }
          />
        ) : (
          <p style={{ fontSize: '0.9rem', color: 'rgb(100,100,100)' }}>
            카테고리를 선택해 주세요
          </p>
        )}
        <br />
        {childCheckBox}
      </div>
    </>
  )
}

export default SelectSize
