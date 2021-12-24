import styles from './AddProductPage.module.css'
import {
  TextField,
  InputAdornment,
  IconButton,
  Grid,
  Divider,
} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import React, { useEffect, useState } from 'react'
import UploadImages from '@components/utils/UploadImages/UploadImages'
import SelectCategory from './section/SelectCategory'
import SelectSize from './section/SelectSize'
import Axios from 'axios'
import { useRouter } from 'next/router'
import { IColor, IProduct } from '@models/Product'
import * as details from 'public/data/productDetail'
import PreNav from '@components/AdminPage/sections/PreNav'

interface InputValue {
  image: string
  subImages: string[]
  name: string
  description: string
  category: string[]
  colors: IColor[]
  sizes: string[]
  price: number
  fit: string
  elastic: string
  opacity: string
  season: string[]
}

interface AddProductPageProps {
  product?: IProduct
}

const AddProductPage = ({ product }: AddProductPageProps) => {
  const router = useRouter()

  const [tempColor, setTempColor] = useState<IColor>({
    colorName: '',
    colorHex: '#ffffff',
  })
  const [colorOptions, setColorOptions] = useState<IColor[]>([])
  const [inputValue, setInputValue] = useState<InputValue>({
    image: product === undefined ? '' : product.image,
    subImages: product === undefined ? [] : product.subImages,
    name: product === undefined ? '' : product.name,
    description: product === undefined ? '' : product.description,
    category: product === undefined ? [] : product.category,
    colors: product === undefined ? [] : product.colors,
    sizes: product === undefined ? [] : product.sizes,
    price: product === undefined ? 0 : product.price,
    fit: product === undefined ? '' : product.fit,
    elastic: product === undefined ? '' : product.elastic,
    opacity: product === undefined ? '' : product.opacity,
    season: product === undefined ? [] : product.season,
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
    fit,
    elastic,
    opacity,
    season,
  } = inputValue

  useEffect(() => {
    Axios.get('/api/product/getColors').then((res) => {
      res.data.colors && setColorOptions(res.data.colors)
    })
  }, [])

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
  const handleChangeColorName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setTempColor({ ...tempColor, colorName: event.target.value.trim() })
  }

  const handleChangeInputValue = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target
    setInputValue({ ...inputValue, [name]: value })
  }

  const handleChangeCategory = (categorys: string[]) => {
    setInputValue({ ...inputValue, category: categorys })
  }

  const onChangeSetSizes = (sizes: string[]) => {
    setInputValue({ ...inputValue, sizes: sizes })
  }

  const handleSetColorHex = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempColor({ colorName: '', colorHex: event.currentTarget.value })
  }

  const handleSetTempColor = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(event.currentTarget.value, 10)
    if (index === -1) {
      return
    }
    setTempColor(colorOptions[index])
  }

  const handleSetColor = () => {
    if (tempColor.colorName.trim() === '') {
      alert('색상 이름을 입력해주세요')
      return
    }
    setInputValue({
      ...inputValue,
      colors: [
        ...colors,
        { ...tempColor, colorName: tempColor.colorName.toUpperCase() },
      ],
    })
    setTempColor({ colorName: '', colorHex: '#FFFFFF' })
  }

  const deleteColor = (index: number) => {
    const newColors = [...colors]
    newColors.splice(index, 1)
    setInputValue({ ...inputValue, colors: newColors })
  }

  const handleChangeSeason = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.currentTarget
    if (checked) {
      setInputValue({ ...inputValue, season: [...season, value] })
    } else {
      const newSeason = season.filter((item) => item !== value)
      setInputValue({ ...inputValue, season: newSeason })
    }
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
        price &&
        fit.length &&
        elastic.length &&
        opacity.length &&
        season.length
      )
    ) {
      alert('모든 항목을 입력해주세요')
      return
    }
    Axios.post('/api/product/add', inputValue)
      .then((res) => {
        res.data?.message ? alert(res.data.message) : alert('등록되었습니다.')
        router.push('/admin/products')
      })
      .catch(() => {
        alert('실패하였습니다.')
      })
  }

  const editProduct = () => {
    if (
      !(
        image.length &&
        name.length &&
        description.length &&
        category.length &&
        colors.length &&
        sizes.length &&
        price &&
        fit.length &&
        elastic.length &&
        opacity.length &&
        season.length
      )
    ) {
      alert('모든 항목을 입력해주세요')
      return
    }

    const body = { pid: product?._id, update: inputValue }

    Axios.post('/api/product/updateProduct', body)
      .then(() => {
        alert('등록되었습니다.')
        router.push('/admin/products/list')
      })
      .catch(() => {
        alert('실패하였습니다.')
      })
  }

  return (
    <>
      <div className={styles.wrapper}>
        <PreNav
          sx={{ fontSize: '0.9rem', textAlign: 'right', marginBottom: '3rem' }}
        />

        <h1 className={styles.title}>
          {product === undefined ? '상품 등록' : '상품 조회 / 수정'}
        </h1>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          {/* 이미지 업로드 */}
          <div>
            <h2 className={styles.subTitle}>대표 이미지 *</h2>
            <UploadImages
              onChangeHandler={updateImage}
              productImages={product && [product.image]}
            />
            <h2 className={styles.subTitle}>
              추가 이미지 {subImages.length} / {5}
            </h2>
            <UploadImages
              onChangeHandler={updateSubImages}
              maxNum={5}
              productImages={product && product.subImages}
            />
          </div>

          {/* 상품명 */}
          <TextField
            required
            sx={{ width: '100%' }}
            label="상품명"
            id="name"
            name="name"
            value={name}
            onChange={handleChangeInputValue}
          />

          {/* 상품설명 */}
          <TextField
            required
            multiline
            rows={3}
            sx={{ width: '100%' }}
            id="description"
            name="description"
            label="상품설명"
            value={description}
            onChange={handleChangeInputValue}
          />

          {/* 가격 */}
          <TextField
            required
            sx={{ width: '200px' }}
            InputProps={{
              endAdornment: <InputAdornment position="end">₩</InputAdornment>,
            }}
            label="가격"
            id="price"
            name="price"
            value={price === 0 ? '' : price}
            onChange={handleChangeInputValue}
          />

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
                  <p
                    className={styles.colorItem}
                    style={{ backgroundColor: `${color.colorHex}` }}
                  >
                    {color.colorName}
                  </p>
                </Grid>
              ))}
            </Grid>
            <div className={styles.colorInput}>
              <input
                className={styles.colorHex}
                type="color"
                id="colorHex"
                name="colorHex"
                value={tempColor.colorHex}
                onChange={handleSetColorHex}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                  label="추가"
                  id="colorName"
                  name="colorName"
                  sx={{ width: '200px' }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton edge="end" onClick={handleSetColor}>
                          <AddCircleOutlineIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  value={tempColor.colorName}
                  onChange={handleChangeColorName}
                  onKeyPress={(event) =>
                    event.key === 'Enter' && handleSetColor()
                  }
                />
                <select
                  name="pets"
                  id="pet-select"
                  onChange={handleSetTempColor}
                >
                  <option value={-1}>--색상--</option>
                  {colorOptions.map((option, index) => (
                    <option
                      key={index}
                      value={index}
                      style={{
                        backgroundColor: option.colorHex,
                        color: 'white',
                      }}
                    >
                      {option.colorName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 카테고리 */}
          <SelectCategory
            pCateogry={product && product.category}
            onChangeHandler={handleChangeCategory}
          />

          {/* 사이즈 */}
          <SelectSize
            pSizes={product && product.sizes}
            category={category}
            handleChange={onChangeSetSizes}
          />

          {/* Detail */}
          <Divider>Details</Divider>
          <div className={styles.details}>
            {/* 핏 */}
            <h2 className={styles.subTitle}>핏 *</h2>
            <div className={styles.detail}>
              {details.fitList.map((item, index) => (
                <label key={index}>
                  <input
                    type="radio"
                    value={item}
                    name="fit"
                    onChange={handleChangeInputValue}
                    checked={item === fit}
                  />
                  {item}
                </label>
              ))}
            </div>
            {/* 신축성 */}
            <h2 className={styles.subTitle}>신축성 *</h2>
            <div className={styles.detail}>
              {details.elasticList.map((item, index) => (
                <label key={index}>
                  <input
                    type="radio"
                    value={item}
                    name="elastic"
                    onChange={handleChangeInputValue}
                    checked={item === elastic}
                  />
                  {item}
                </label>
              ))}
            </div>
            {/* 비침 */}
            <h2 className={styles.subTitle}>비침 *</h2>
            <div className={styles.detail}>
              {details.opacityList.map((item, index) => (
                <label key={index}>
                  <input
                    type="radio"
                    value={item}
                    name="opacity"
                    checked={item === opacity}
                    onChange={handleChangeInputValue}
                  />
                  {item}
                </label>
              ))}
            </div>
            {/* 계절 */}
            <h2 className={styles.subTitle}>계절 *</h2>
            <div className={styles.detail}>
              {details.seasonList.map((item, index) => (
                <label key={index}>
                  <input
                    type="checkbox"
                    value={item}
                    name="season"
                    onChange={handleChangeSeason}
                    checked={season.find((s) => s === item) !== undefined}
                  />
                  {season}
                </label>
              ))}
            </div>
          </div>
          {product === undefined ? (
            <button type="button" onClick={addProuct} className={styles.addBtn}>
              상품 등록
            </button>
          ) : (
            <button
              type="button"
              onClick={editProduct}
              className={styles.addBtn}
            >
              상품 수정
            </button>
          )}
        </form>
      </div>
    </>
  )
}

export default AddProductPage
