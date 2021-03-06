import Link from 'next/link'
import styles from './PreMenu.module.css'
import React from 'react'
import { useRouter } from 'next/router'
import { ISubCategoryPageQuery } from 'pages/product/[mainCategory]/[subCategory]'

interface PreMenuProps {
  sx?: React.CSSProperties
  is_event?: boolean
}

const PreMenu = ({ sx, is_event = false }: PreMenuProps) => {
  const router = useRouter()
  const { mainCategory, subCategory, itemCategory, keyword } =
    router.query as ISubCategoryPageQuery

  return (
    <ol className={styles.nav} style={sx}>
      <li>
        <Link href="/">HOME</Link>
      </li>
      {is_event ? (
        <li>
          <Link href="/product/event">EVENT</Link>
        </li>
      ) : (
        <></>
      )}
      {keyword && (
        <li>
          <Link href="/product/search">상품검색</Link>
        </li>
      )}
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
