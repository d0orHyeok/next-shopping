import Link from 'next/link'
import styles from './PreMenu.module.css'
import React from 'react'

interface PreMenuProps {
  category: string[]
  sx?: React.CSSProperties
}

const PreMenu = ({ category, sx }: PreMenuProps) => {
  return (
    <ol className={styles.nav} style={sx}>
      <li>
        <Link href="/">HOME</Link>
      </li>
      {category.map((path, index) => (
        <li key={index}>
          <Link href={`/product/${category.slice(0, index + 1).join('/')}`}>
            {path.toUpperCase()}
          </Link>
        </li>
      ))}
    </ol>
  )
}

export default PreMenu
