import InputBase from '@mui/material/InputBase'
import IconButton from '@mui/material/IconButton'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import CloseIcon from '@mui/icons-material/Close'

import styles from './SearchBox.module.css'

const SearchBox = () => {
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
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div className={styles.inputWrapper}>
          <InputBase className={styles.input} placeholder="상품을 찾아보세요" />
          <IconButton type="button" color="inherit" sx={{ p: '5px' }}>
            <SearchOutlinedIcon />
          </IconButton>
        </div>
      </div>
    </>
  )
}

export default SearchBox
