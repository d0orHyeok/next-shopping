import styles from './AddProductPage.module.css'
import { TextField, InputAdornment, IconButton, Grid } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import React, { useState } from 'react'
import UploadImages from '@components/utils/UploadImages/UploadImages'
import SelectCategory from './section/SelectCategory'
import SelectSize from './section/SelectSize'
import Axios from 'axios'
import { useRouter } from 'next/router'

interface InputValue {
  image: string
  subImages: string[]
  name: string
  description: string
  category: string[]
  colors: string[]
  sizes: string[]
  price: number
}

const AddProductPage = () => {
  const router = useRouter()

  const [tempColor, setTempColor] = useState('')
  const [inputValue, setInputValue] = useState<InputValue>({
    image: '',
    subImages: [],
    name: '',
    description: '',
    category: [],
    colors: [],
    sizes: [],
    price: 0,
  })
  const {
    image,
    subImages,
    name,
    description,
    category,
    colors,
    sizes,
    price,
  } = inputValue

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
  const handleChangeTempColor = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTempColor(event.target.value)
  }

  const handleChangeInputValue = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = event.target
    setInputValue({ ...inputValue, [id]: value })
  }

  const handleChangeCategory = (categorys: string[]) => {
    setInputValue({ ...inputValue, category: categorys })
  }

  const onChangeSetSizes = (sizes: string[]) => {
    setInputValue({ ...inputValue, sizes: sizes })
  }

  const hamdleSetColor = () => {
    setInputValue({ ...inputValue, colors: [...colors, tempColor] })
    setTempColor('')
  }

  const deleteColor = (index: number) => {
    const newColors = [...colors]
    newColors.splice(index, 1)
    setInputValue({ ...inputValue, colors: newColors })
  }

  // 상품 등록시 함수
  const addProuct = () => {
    if (
      !(
        image.length &&
        name.length &&
        description.length &&
        category.length &&
        colors.length &&
        sizes.length &&
        price
      )
    ) {
      alert('모든 항목을 입력해주세요')
      return
    }
    Axios.post('/api/product/add', inputValue)
      .then((res) => {
        res.data?.message ? alert(res.data.message) : alert('등록되었습니다.')
        router.push('/admin/')
      })
      .catch(() => {
        alert('실패하였습니다.')
      })
  }

  return (
    <>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>상품 등록</h1>
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
            onChange={handleChangeInputValue}
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
            onChange={handleChangeInputValue}
          />

          {/* 카테고리 */}
          <SelectCategory onChangeHandler={handleChangeCategory} />

          {/* 색상 */}
          <div className={styles.color}>
            <h2 className={styles.subTitle}>색상 *</h2>

            <Grid container spacing={2} sx={{ marginBottom: '1rem' }}>
              {!colors.length && (
                <Grid item xs={12}>
                  <p style={{ fontSize: '0.9rem', color: 'rgb(100,100,100)' }}>
                    색상을 추가해주세요
                  </p>
                </Grid>
              )}
              {/* 색상 추가시 표시 */}
              {colors.map((color, index) => (
                <Grid
                  item
                  xs={2}
                  sm={1.5}
                  key={index}
                  onClick={() => deleteColor(index)}
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
                    <IconButton edge="end" onClick={hamdleSetColor}>
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              value={tempColor}
              onChange={handleChangeTempColor}
            />
          </div>

          {/* 사이즈 */}
          <SelectSize category={category} handleChange={onChangeSetSizes} />

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
            onChange={handleChangeInputValue}
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
