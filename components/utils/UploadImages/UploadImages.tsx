import React, { useEffect, useState } from 'react'
import Dropzone from 'react-dropzone'
import AddIcon from '@mui/icons-material/Add'
import Axios from 'axios'
import styles from './UploadImages.module.css'

interface UploadImageProps {
  defaultImages?: string[]
  maxNum?: 1 | 2 | 3 | 4 | 5
  onChangeHandler?: (images: any) => void
  showDirection?: 'row' | 'column'
  dropzoneStyle?: React.CSSProperties
  imgStyle?: React.CSSProperties
}

const UploadImages = ({
  defaultImages,
  maxNum = 1,
  onChangeHandler,
  showDirection = 'row',
  dropzoneStyle,
  imgStyle,
}: UploadImageProps) => {
  const [Images, setImages] = useState<string[]>([])

  useEffect(() => {
    if (defaultImages) {
      setImages(defaultImages)
    }
  }, [])

  const onDropHandler = (files: any) => {
    if (Images.length === maxNum) {
      return alert('더 이상 업로드 할 수 없습니다.')
    }

    const formData = new FormData()
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
    }
    formData.append('file', files[0])

    Axios.post('/api/upload/image', formData, config).then((res) => {
      if (res.data.success) {
        setImages([...Images, res.data.filePath])
        if (onChangeHandler) {
          onChangeHandler(
            maxNum === 1 ? res.data.filePath : [...Images, res.data.filePath]
          )
        }
      } else {
        console.log('err')
        alert('파일을 저장하는데 실패했습니다.')
      }
    })
  }

  const deleteHandler = (image: string) => {
    if (!confirm('이미지를 삭제하시겠습니까?')) {
      return
    }

    const currentIndex = Images.indexOf(image)
    const newImages = [...Images]
    newImages.splice(currentIndex, 1)
    setImages(newImages)
    if (onChangeHandler) {
      onChangeHandler(newImages)
    }

    Axios.post('/api/upload/deleteImage', { path: Images[currentIndex] })
  }

  return (
    <div className={styles.wrapper} style={{ flexDirection: showDirection }}>
      <Dropzone onDrop={onDropHandler}>
        {({ getRootProps, getInputProps }) => (
          <div
            className={styles.dropwrap}
            {...getRootProps()}
            style={dropzoneStyle}
          >
            <input {...getInputProps()} />
            <AddIcon />
          </div>
        )}
      </Dropzone>
      {Images.length ? (
        <div className={styles.imgContainer}>
          {Images.map((image, index) => (
            <div
              key={index}
              className={styles.imgBox}
              style={imgStyle}
              onClick={() => deleteHandler(image)}
            >
              <img
                className={styles.displayImage}
                style={imgStyle}
                src={`${image}`}
                alt="product"
              />
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default UploadImages
