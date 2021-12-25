import Link from 'next/link'
import styles from './PreMenu.module.css'
import React from 'react'
import { useRouter } from 'next/router'
import { ISubCategoryPageQuery } from 'pages/product/[mainCategory]/[subCategory]'

interface PreMenuProps {
  sx?: React.CSSProperties
}

const PreMenu = ({ sx }: PreMenuProps) => {
  const router = useRouter()
  const { mainCategory, subCategory, itemCategory } =
    router.query as ISubCategoryPageQuery

  return (
    <ol className={styles.nav} style={sx}>
      <li>
        <Link href="/">HOME</Link>
      </li>
      {mainCategory && (
        <li>
          <Link href={`/product/${mainCategory}`}>
            {mainCategory.toUpperCase()}
          </Link>
        </li>
      )}
      {subCategory && (
        <li>
          <Link href={`/product/${mainCategory}/${subCategory}`}>
            {subCategory.toUpperCase()}
          </Link>
        </li>
      )}
      {itemCategory && (
        <li>
          <Link
            href={{
              pathname: `/product/${mainCategory}/${subCategory}`,
              query: { itemCategory },
            }}
          >
            {itemCategory.toUpperCase()}
          </Link>
        </li>
      )}
    </ol>
  )
}

export default PreMenu
