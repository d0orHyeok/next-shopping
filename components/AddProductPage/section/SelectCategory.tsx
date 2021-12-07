import { MenuItem, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import styles from '../AddProductPage.module.css'
import categoryData from 'public/data/category.json'

interface Category {
  value: string
  label: string
}

interface CategoryItems {
  mainItems: Category[]
  subItems: Category[]
  lastItems: string[]
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
  const [categoryItems, setCategoryItems] = useState<CategoryItems>({
    mainItems: [],
    subItems: [],
    lastItems: [],
  })
  const { mainCategory, subCategory, lastCategory } = category
  const { mainItems, subItems, lastItems } = categoryItems

  // json파일로 부터 분류를 선택받아 카테고리를 배열로 리턴
  const getChangeCategoryItems = (data: any) => {
    let changedCategoryItems: Category[] = []

    data.map((item: { name: string }) => {
      changedCategoryItems = [
        ...changedCategoryItems,
        {
          value: item.name,
          label: item.name.toUpperCase(),
        },
      ]
    })
    return changedCategoryItems
  }

  useEffect(() => {
    // 처음 로드시 json데이터를 state에 저장
    setCategoryItems({
      ...categoryItems,
      mainItems: getChangeCategoryItems(categoryData),
    })
  }, [])

  useEffect(() => {
    // 마지막 카테고리 까지 선택되었으면 카테고리 결과를 설정한다
    // 아닐경우 빈 배열로 다시 설정
    lastCategory === '선택'
      ? onChangeHandler([])
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
      if (value === '선택') {
        // 메인카테고리가 선택되지 않았으므로 서브카테고리를 알 수 없음
        // 빈배열로 설정
        setCategoryItems({ ...categoryItems, subItems: [], lastItems: [] })
      } else {
        const subCategoryData = categoryData.filter(
          (mainItem) => mainItem.name === value
        )[0].value

        setCategoryItems({
          ...categoryItems,
          subItems: getChangeCategoryItems(subCategoryData),
          lastItems: [],
        })
      }
    } else if (name === 'subCategory') {
      // 서브카테고리 선택 시
      setCategory({
        ...category,
        subCategory: value,
        lastCategory: '선택',
      })
      if (value === '선택') {
        // 서브카테고리가 선택되지 않았으므로 마지막카테고리를 알 수 없음
        // 빈배열로 설정
        setCategoryItems({ ...categoryItems, lastItems: [] })
      } else {
        const lastCategoryData = categoryData
          .filter((mainItem) => mainItem.name === mainCategory)[0]
          .value.filter((subItem) => subItem.name === value)[0].value

        setCategoryItems({ ...categoryItems, lastItems: lastCategoryData })
      }
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
            {mainItems &&
              mainItems.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
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
            {subItems &&
              subItems.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
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
            {lastItems &&
              lastItems.map((item) => (
                <MenuItem key={item} value={item}>
                  {item.toUpperCase()}
                </MenuItem>
              ))}
          </TextField>
        </div>
      </div>
    </>
  )
}

export default SelectCategory
