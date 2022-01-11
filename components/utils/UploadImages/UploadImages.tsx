import React, { useEffect, useState } from 'react'
import Dropzone from 'react-dropzone'
import AddIcon from '@mui/icons-material/Add'
import { Grid } from '@mui/material'
import Axios from 'axios'
import styles from './UploadImages.module.css'

interface UploadImageProps {
  defaultImages?: string[]
  maxNum?: 1 | 2 | 3 | 4 | 5
  onChangeHandler?: (images: any) => void
}

const UploadImages = ({
  defaultImages,
  maxNum = 1,
  onChangeHandler,
}: UploadImageProps) => {
  const [Images, setImages] = useState<string[]>([])

  useEffect(() => {
    if (defaultImages) {
      setImages(defaultImages)
    }
  }, [defaultImages])

  const onDropHandler = (files: any) => {
    if (Images.length === maxNum) {
      return alert('더 이상 업로드 할 수 없습니다.')
    }

    const formData = new FormData()
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
    }
    formData.append('file', files[0])

    console.log(files[0])

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
    <div className={styles.wrapper}>
      <Dropzone onDrop={onDropHandler}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div className={styles.dropwrap} {...getRootProps()}>
              <input {...getInputProps()} />
              <AddIcon style={{ fontSize: '2.5rem' }} />
            </div>
          </section>
        )}
      </Dropzone>
      {maxNum !== 1 ? (
        <>
          <Grid container spacing={1} style={{ marginLeft: '1rem' }}>
            {Images.map((image, index) => (
              <Grid key={index} item xs={6}>
                <div onClick={() => deleteHandler(image)}>
                  <img
                    className={styles.displayImage}
                    src={`${image}`}
                    alt="product"
                  />
                </div>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        Images.map((image, index) => (
          <Grid key={index} item xs={12}>
            <div
              style={{ marginLeft: '1rem' }}
              onClick={() => deleteHandler(image)}
            >
              <img
                className={styles.displayImage}
                src={`${image}`}
                alt="product"
              />
            </div>
          </Grid>
        ))
      )}
    </div>
  )
}

export default UploadImages
