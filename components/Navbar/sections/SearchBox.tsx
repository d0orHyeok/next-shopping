import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import styles from './SearchBox.module.css'
import React, { useState } from 'react'
import { useRouter } from 'next/router'

interface SearchBoxProops {
  onClose?: (open: boolean) => void
}

const SearchBox = ({ onClose }: SearchBoxProops) => {
  const router = useRouter()

  const [input, setInput] = useState('')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }

  const handleSearch = () => {
    setInput('')
    router.push(`/product/search/${input}`)
    onClose && onClose(false)
  }

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.titleWrapper}>
          <h1 className={styles.title}>무엇을 찾으시나요?</h1>
          <IconButton
            className={styles.closeBtn}
            type="button"
            color="inherit"
            sx={{ p: '5px' }}
            onClick={() => onClose && onClose(false)}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div className={styles.inputWrapper}>
          <InputBase
            className={styles.input}
            placeholder="상품을 찾아보세요"
            value={input}
            onChange={handleChange}
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
