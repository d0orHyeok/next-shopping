import { useEffect, useState } from 'react'
import { Checkbox, FormControlLabel } from '@mui/material'
import styles from '../AddProductPage.module.css'
import sizeData from 'public/data/size.json'

interface SelectSizeProps {
  category: string[]
  handleChange: (sizes: string[]) => void
}

const SelectSize = ({ category, handleChange }: SelectSizeProps) => {
  const [sizeItems, setSizeItems] = useState<string[]>([]) // 사이즈 정보를 담는다
  const [sizeChecked, setSizeChecked] = useState<boolean[]>([]) // checkbox 정보

  useEffect(() => {
    // 카테고리에 맞는 사이즈 정보를 설정한다

    // 홈웨어인 경우 남성, 여성, 아동 정보가 index2에 있다
    const filter = category[0] === 'homewear' ? category[2] : category[0]
    // filter에 맞는 size정보를 가져와 설정
    const newSizeItems = sizeData.filter((item) => item.name === filter)[0]
    newSizeItems ? setSizeItems(newSizeItems.sizes) : setSizeItems([])
  }, [category])

  useEffect(() => {
    // 사이즈 정보가 갱신되면 그에맞는 checkbox정보를 설정
    const newSizeChecked = sizeItems.map((_) => false)
    setSizeChecked(newSizeChecked)
  }, [sizeItems])

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
