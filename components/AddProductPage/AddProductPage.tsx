import styles from './AddProductPage.module.css'
import {
  MenuItem,
  TextField,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  IconButton,
  Grid,
} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import React, { useState } from 'react'
import UploadImages from '@components/utils/UploadImages/UploadImages'

interface InputValue {
  image: string
  subImages: string[]
  name: string
  description: string
  colors: string[]
  size: string
  price: number
}

const currencies = [
  {
    value: 'men',
    label: 'Men',
  },
  {
    value: 'women',
    label: 'Women',
  },
  {
    value: 'kids',
    label: 'Kids',
  },
  {
    value: 'inner',
    label: 'Home/Innerwears',
  },
]

const AddProductPage = () => {
  const [currency, setCurrency] = useState('men')
  const [tempValue, setTempValue] = useState({
    tempColor: '',
  })
  const { tempColor } = tempValue
  const [inputValue, setInputValue] = useState<InputValue>({
    image: '',
    subImages: [],
    name: '',
    description: '',
    colors: [],
    size: '',
    price: 0,
  })
  const { image, subImages, name, description, colors, size, price } =
    inputValue

  // 이미지 업데이트시 함수들
  const updateImage = (newImages: any) => {
    setInputValue({
      ...inputValue,
      image: newImages[0] ? newImages[0] : '',
    })
  }

  const updateSubImages = (newImages: any) => {
    setInputValue({
      ...inputValue,
      subImages: newImages,
    })
  }

  // State 변경시 함수들
  const onChangeSetTempValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setTempValue({ ...tempValue, [name]: value })
  }

  const onChangeSetInputValue = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = event.target
    setInputValue({ ...inputValue, [id]: value })
  }

  const onClickSetInputValue = () => {
    setInputValue({ ...inputValue, colors: [...colors, tempColor] })
    setTempValue({ ...tempValue, tempColor: '' })
  }

  const onClickDeleteColor = (index: number) => {
    const newColors = [...colors]
    newColors.splice(index, 1)
    setInputValue({ ...inputValue, colors: newColors })
  }

  // 상품 등록시 함수
  const addProuct = () => {
    if (
      !(
        image.length &&
        subImages.length &&
        name.length &&
        description.length &&
        colors.length &&
        size.length &&
        price
      )
    ) {
      alert('모든 항목을 입력해주세요')
    }
  }

  //  임시
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrency(event.target.value)
  }

  const [checked, setChecked] = useState([false, false])

  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, event.target.checked])
  }

  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, checked[1]])
  }

  const handleChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([checked[0], event.target.checked])
  }

  console.log(inputValue)

  const children = (
    <div style={{ display: 'flex', marginLeft: '0.5rem' }}>
      <FormControlLabel
        label="사이즈1"
        control={<Checkbox checked={checked[0]} onChange={handleChange2} />}
      />
      <FormControlLabel
        label="사이즈2"
        control={<Checkbox checked={checked[1]} onChange={handleChange3} />}
      />
    </div>
  )

  return (
    <>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Upload Product</h1>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          {/* 이미지 업로드 */}
          <div>
            <h2 className={styles.subTitle}>대표 이미지 *</h2>
            <UploadImages onChangeHandler={updateImage} />
            <h2 className={styles.subTitle}>
              추가 이미지 {subImages.length} / {5}
            </h2>
            <UploadImages onChangeHandler={updateSubImages} maxNum={5} />
          </div>

          {/* 상품명 */}
          <TextField
            required
            sx={{ width: '100%' }}
            label="상품명"
            id="name"
            value={name}
            onChange={onChangeSetInputValue}
          />

          {/* 상품설명 */}
          <TextField
            required
            multiline
            rows={4}
            sx={{ width: '100%' }}
            id="description"
            label="상품설명"
            helperText="HTML 형식으로 입력해주세요"
            value={description}
            onChange={onChangeSetInputValue}
          />

          {/* 카테고리 */}
          <div className={styles.category}>
            <h2 className={styles.subTitle}>
              카테고리 *
              <IconButton>
                <AddCircleOutlineIcon />
              </IconButton>
            </h2>
            <div className={styles.categoryGroup}>
              <TextField
                required
                id="category"
                select
                label="대분류"
                value={currency}
                onChange={handleChange}
                helperText="대분류"
                sx={{ width: '200px' }}
              >
                {currencies.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                required
                id="category"
                select
                label="소분류"
                value={currency}
                onChange={handleChange}
                helperText="소분류"
                sx={{ width: '200px' }}
              >
                {currencies.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                id="category"
                select
                label="종류"
                value={currency}
                onChange={handleChange}
                helperText="종류"
                sx={{ width: '200px' }}
              >
                {currencies.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>

          {/* 색상 */}
          <div className={styles.color}>
            <h2 className={styles.subTitle}>색상 *</h2>
            <Grid container spacing={2} sx={{ marginBottom: '1rem' }}>
              {/* 색상 추가시 표시 */}
              {colors.map((color, index) => (
                <Grid
                  item
                  xs={2}
                  sm={1.5}
                  key={index}
                  onClick={() => onClickDeleteColor(index)}
                >
                  <p className={styles.colorItem}>{color}</p>
                </Grid>
              ))}
            </Grid>
            <TextField
              label="추가"
              id="color"
              name="tempColor"
              sx={{ width: '200px' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" onClick={onClickSetInputValue}>
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              value={tempColor}
              onChange={onChangeSetTempValue}
            />
          </div>

          {/* 사이즈 */}
          <div className={styles.size}>
            <h2 className={styles.subTitle}>사이즈 *</h2>
            <FormControlLabel
              label="All"
              control={
                <Checkbox
                  checked={checked[0] && checked[1]}
                  indeterminate={checked[0] !== checked[1]}
                  onChange={handleChange1}
                />
              }
            />
            {children}
          </div>

          {/* 가격 */}
          <TextField
            required
            sx={{ width: '200px' }}
            InputProps={{
              endAdornment: <InputAdornment position="end">₩</InputAdornment>,
            }}
            label="가격"
            id="price"
            value={price === 0 ? '' : price}
            onChange={onChangeSetInputValue}
          />

          <button type="button" onClick={addProuct} className={styles.addBtn}>
            상품 등록
          </button>
        </form>
      </div>
    </>
  )
}

export default AddProductPage
