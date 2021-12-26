import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import styles from './SearchBox.module.css'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const SearchBox = () => {
  const router = useRouter()

  const [input, setInput] = useState('')
  const { keyword } = router.query

  useEffect(() => {
    keyword && setInput(keyword.toString())
  }, [keyword])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }

  const handleKeyPressed = (event: React.KeyboardEvent<HTMLElement>) => {
    event.key === 'Enter' && handleSearch()
  }

  const handleSearch = () => {
    router.push({
      pathname: '/product/search',
      query: { keyword: input },
    })
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>무엇을 찾으시나요?</h1>
        </div>
        <div className={styles.inputWrapper}>
          <InputBase
            className={styles.input}
            placeholder="상품을 찾아보세요"
            value={input}
            onChange={handleChange}
            onKeyPress={handleKeyPressed}
          />
          <IconButton
            type="button"
            color="inherit"
            sx={{ p: '5px' }}
            onClick={handleSearch}
          >
            <SearchOutlinedIcon />
          </IconButton>
        </div>
      </div>
    </>
  )
}

export default SearchBox
