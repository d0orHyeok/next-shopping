import { IColor, IProduct } from '@models/Product'
import React, { useEffect, useState } from 'react'
import styles from './SelectOption.module.css'

interface ISelectOptionProps {
  product: IProduct
  onSelect?: (select: any) => void
}

interface ISelect {
  color: IColor
  size: string
}

const SelectOption = ({ product, onSelect }: ISelectOptionProps) => {
  const [select, setSelect] = useState<ISelect>({
    color: {
      colorName: '',
      colorHex: '',
    },
    size: '',
  })

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target

    if (name === 'colors' && value !== '') {
      const newColor = JSON.parse(value)
      setSelect({ ...select, color: newColor })
    }

    if (name === 'size' && value !== '') {
      setSelect({ ...select, size: value })
    }
  }

  useEffect(() => {
    if (select.color.colorName !== '' && select.size !== '') {
      onSelect && onSelect(select)
    }
  }, [select])

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={styles.name}>{product.name}</h1>
        <h1 className={styles.title}>상품 옵션</h1>
        <div className={styles.optionWrapper}>
          <label htmlFor="colors">Colors</label>
          <select name="colors" id="colors" onChange={handleChange}>
            <option value="">--- select ---</option>
            {product.colors.map((color, index) => (
              <option key={index} value={JSON.stringify(color)}>
                {color.colorName}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.optionWrapper}>
          <label htmlFor="size">Size</label>
          <select name="size" id="size" onChange={handleChange}>
            <option value="">--- select ---</option>
            {product.sizes.map((size, index) => (
              <option key={index} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default SelectOption
