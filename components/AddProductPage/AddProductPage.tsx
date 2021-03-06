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
  event_name: string
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
  const [eventList, setEventList] = useState<string[]>([])
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
    event_name: product === undefined ? '' : product.event_name,
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
    event_name,
  } = inputValue

  useEffect(() => {
    Axios.get('/api/product/getColors')
      .then((res) => {
        res.data.colors && setColorOptions(res.data.colors)
      })
      .catch((err) => console.log(err))
    Axios.get('/api/product/getEventNames')
      .then((res) => {
        res.data.eventNames && setEventList(res.data.eventNames)
      })
      .catch((err) => console.log(err))
  }, [])

  // ????????? ??????????????? ?????????
  const updateImage = (newImages: any) => {
    const setImage = !newImages.length
      ? ''
      : Array.isArray(newImages)
      ? newImages[0]
      : newImages
    setInputValue({
      ...inputValue,
      image: setImage,
    })
  }

  const updateSubImages = (newImages: any) => {
    setInputValue({
      ...inputValue,
      subImages: newImages,
    })
  }

  // State ????????? ?????????
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
      alert('?????? ????????? ??????????????????')
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

  const handleSelectEvnetOption = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setInputValue({ ...inputValue, event_name: event.target.value })
  }

  // ?????? ????????? ??????
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
      alert('?????? ????????? ??????????????????')
      return
    }

    if (event_name.trim().length < 2) {
      return alert('????????? ????????? ??????????????? ??????????????????.')
    }

    const body =
      event_name.length > 1 ? { ...inputValue, is_event: true } : inputValue

    Axios.post('/api/product/add', body)
      .then((res) => {
        res.data?.message ? alert(res.data.message) : alert('?????????????????????.')
        router.push('/admin/products')
      })
      .catch(() => {
        alert('?????????????????????.')
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
      alert('?????? ????????? ??????????????????')
      return
    }

    if (event_name.trim().length < 2) {
      return alert('????????? ????????? ??????????????? ??????????????????.')
    }

    const body = {
      pid: product?._id,
      update: {
        ...inputValue,
        is_event: event_name.length >= 2 ? true : false,
      },
    }

    Axios.post('/api/product/updateProduct', body)
      .then(() => {
        alert('?????????????????????.')
        router.push('/admin/products/list')
      })
      .catch(() => {
        alert('?????????????????????.')
      })
  }

  return (
    <>
      <div className={styles.wrapper}>
        <PreNav
          sx={{ fontSize: '0.9rem', textAlign: 'right', marginBottom: '3rem' }}
        />

        <h1 className={styles.title}>
          {product === undefined ? '?????? ??????' : '?????? ?????? / ??????'}
        </h1>
        <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
          {/* ????????? ????????? */}
          <div>
            <h2 className={styles.subTitle}>?????? ????????? *</h2>
            <UploadImages
              onChangeHandler={updateImage}
              defaultImages={product && [product.image]}
            />
            <h2 className={styles.subTitle}>
              ?????? ????????? {subImages.length} / {5}
            </h2>
            <UploadImages
              onChangeHandler={updateSubImages}
              maxNum={5}
              defaultImages={product && product.subImages}
            />
          </div>

          {/* ????????? */}
          <TextField
            required
            sx={{ width: '100%' }}
            label="?????????"
            id="name"
            name="name"
            value={name}
            onChange={handleChangeInputValue}
          />

          {/* ???????????? */}
          <TextField
            required
            multiline
            rows={3}
            sx={{ width: '100%' }}
            id="description"
            name="description"
            label="????????????"
            value={description}
            onChange={handleChangeInputValue}
          />

          {/* ?????? */}
          <TextField
            required
            sx={{ width: '200px' }}
            InputProps={{
              endAdornment: <InputAdornment position="end">???</InputAdornment>,
            }}
            label="??????"
            id="price"
            name="price"
            value={price === 0 ? '' : price}
            onChange={handleChangeInputValue}
          />

          {/* ?????? */}
          <div className={styles.color}>
            <h2 className={styles.subTitle}>?????? *</h2>
            <Grid container spacing={2} sx={{ marginBottom: '1rem' }}>
              {!colors.length && (
                <Grid item xs={12}>
                  <p style={{ fontSize: '0.9rem', color: 'rgb(100,100,100)' }}>
                    ????????? ??????????????????
                  </p>
                </Grid>
              )}
              {/* ?????? ????????? ?????? */}
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
                  label="??????"
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
                  <option value={-1}>--??????--</option>
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

          {/* ???????????? */}
          <SelectCategory
            pCateogry={product && product.category}
            onChangeHandler={handleChangeCategory}
          />

          {/* ????????? */}
          <SelectSize
            pSizes={product && product.sizes}
            category={category}
            handleChange={onChangeSetSizes}
          />

          {/* Detail */}
          <Divider>Details</Divider>
          <div className={styles.details}>
            {/* ??? */}
            <h2 className={styles.subTitle}>??? *</h2>
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
            {/* ????????? */}
            <h2 className={styles.subTitle}>????????? *</h2>
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
            {/* ?????? */}
            <h2 className={styles.subTitle}>?????? *</h2>
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
            {/* ?????? */}
            <h2 className={styles.subTitle}>?????? *</h2>
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
                  {item}
                </label>
              ))}
            </div>
          </div>
          <Divider>Event</Divider>
          {/* ???????????? */}
          <TextField
            sx={{ maxWidth: '320px', width: '100%' }}
            label="????????????"
            helperText="?????????, ????????? ????????? ?????? ??????"
            id="event_name"
            name="event_name"
            value={event_name}
            onChange={handleChangeInputValue}
          />
          <select
            name="event_name_list"
            id="event_name_list"
            onChange={handleSelectEvnetOption}
            style={{ maxWidth: '320px', width: '100%' }}
          >
            <option value="">--- ???????????? ????????? ??? ????????? ---</option>
            {eventList.map((eventName) => (
              <option key={eventName} value={eventName}>
                {eventName}
              </option>
            ))}
          </select>
          {product === undefined ? (
            <button type="button" onClick={addProuct} className={styles.addBtn}>
              ?????? ??????
            </button>
          ) : (
            <button
              type="button"
              onClick={editProduct}
              className={styles.addBtn}
            >
              ?????? ??????
            </button>
          )}
        </form>
      </div>
    </>
  )
}

export default AddProductPage
