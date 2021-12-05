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
import { useState } from 'react'

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrency(event.target.value)
  }

  const [checked, setChecked] = useState([true, false])

  const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, event.target.checked])
  }

  const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([event.target.checked, checked[1]])
  }

  const handleChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked([checked[0], event.target.checked])
  }

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
          <div>이미지 업로드</div>

          {/* 상품명 */}
          <TextField required id="name" sx={{ width: '100%' }} label="상품명" />

          {/* 상품설명 */}
          <TextField
            required
            id="description"
            label="상품설명"
            multiline
            rows={4}
            sx={{ width: '100%' }}
          />

          {/* 카테고리 */}
          <div className={styles.category}>
            <h2 className={styles.subTitle}>카테고리 *</h2>
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
              <Grid item xs={2} sm={1.5}>
                <p className={styles.colorItem}>color</p>
              </Grid>
              <Grid item xs={2} sm={1.5}>
                <p className={styles.colorItem}>color</p>
              </Grid>
              <Grid item xs={2} sm={1.5}>
                <p className={styles.colorItem}>color</p>
              </Grid>
              <Grid item xs={2} sm={1.5}>
                <p className={styles.colorItem}>color</p>
              </Grid>
            </Grid>
            <TextField
              label="추가"
              id="color"
              sx={{ width: '200px' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end">
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
            label="가격"
            id="price"
            sx={{ width: '200px' }}
            InputProps={{
              endAdornment: <InputAdornment position="end">₩</InputAdornment>,
            }}
          />

          <button className={styles.addBtn}>상품 등록</button>
        </form>
      </div>
    </>
  )
}

export default AddProductPage
