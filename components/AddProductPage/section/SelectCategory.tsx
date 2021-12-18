import { MenuItem, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import styles from '../AddProductPage.module.css'
import * as getCategorys from '@libs/getCategory'

interface Categorys {
  mainCategorys: string[]
  subCategorys: string[]
  itemCategorys: string[]
}

interface SelectCategoryProps {
  onChangeHandler: (categorys: string[]) => void
}

const SelectCategory = ({ onChangeHandler }: SelectCategoryProps) => {
  const [category, setCategory] = useState({
    mainCategory: '선택',
    subCategory: '선택',
    lastCategory: '선택',
  })

  const [categorys, setCategorys] = useState<Categorys>({
    mainCategorys: [],
    subCategorys: [],
    itemCategorys: [],
  })
  const { mainCategory, subCategory, lastCategory } = category
  const { mainCategorys, subCategorys, itemCategorys } = categorys

  useEffect(() => {
    // 처음 로드시 json데이터를 state에 저장
    setCategorys({
      ...categorys,
      mainCategorys: getCategorys.getMainCategorys(),
    })
  }, [])

  useEffect(() => {
    // 마지막 카테고리 까지 선택되었으면 카테고리 결과를 설정한다
    // 아닐경우 빈 배열로 다시 설정
    lastCategory === '선택'
      ? onChangeHandler([])
      : lastCategory === '전체보기'
      ? onChangeHandler([mainCategory, subCategory])
      : onChangeHandler([mainCategory, subCategory, lastCategory])
  }, [lastCategory])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target

    // 메인카테고리 선택 시
    if (name === 'mainCategory') {
      setCategory({
        mainCategory: value,
        subCategory: '선택',
        lastCategory: '선택',
      })

      const newSubCategorys = getCategorys.getSubCateogrys(value)
      setCategorys({
        ...categorys,
        subCategorys: newSubCategorys,
        itemCategorys: [],
      })
    } else if (name === 'subCategory') {
      // 서브카테고리 선택 시
      setCategory({
        ...category,
        subCategory: value,
        lastCategory: '선택',
      })

      const newItemCategorys = getCategorys.getItemCategorys(
        mainCategory,
        value
      )
      setCategorys({ ...categorys, itemCategorys: newItemCategorys })
    } else {
      // 마지막 카테고리 선택 시
      setCategory({ ...category, [name]: value })
    }
  }

  return (
    <>
      <div className={styles.category}>
        <h2 className={styles.subTitle}>카테고리 *</h2>
        <div className={styles.categoryGroup}>
          {/* 메인 카테고리 */}
          <TextField
            required
            id="mainCategory"
            name="mainCategory"
            select
            label="대분류"
            value={mainCategory}
            onChange={handleChange}
            helperText="대분류"
            sx={{ width: '200px' }}
          >
            <MenuItem value={'선택'}>선택</MenuItem>
            {mainCategorys &&
              mainCategorys.map((category, index) => (
                <MenuItem key={index} value={category}>
                  {category.toUpperCase()}
                </MenuItem>
              ))}
          </TextField>
          {/* 서브카테고리 */}
          <TextField
            required
            id="subCategory"
            name="subCategory"
            select
            label="소분류"
            value={subCategory}
            onChange={handleChange}
            helperText="소분류"
            sx={{ width: '200px' }}
          >
            <MenuItem value={'선택'}>선택</MenuItem>
            {subCategorys &&
              subCategorys.map((category, index) => (
                <MenuItem key={index} value={category}>
                  {category.toUpperCase()}
                </MenuItem>
              ))}
          </TextField>
          {/* 마지막카테고리 */}
          <TextField
            id="lastCategory"
            name="lastCategory"
            select
            label="종류"
            value={lastCategory}
            onChange={handleChange}
            helperText="종류"
            sx={{ width: '200px' }}
          >
            <MenuItem value={'선택'}>선택</MenuItem>
            {itemCategorys &&
              itemCategorys.map((category, index) => (
                <MenuItem key={index} value={category}>
                  {category.toUpperCase()}
                </MenuItem>
              ))}
          </TextField>
        </div>
      </div>
    </>
  )
}

export default SelectCategory
