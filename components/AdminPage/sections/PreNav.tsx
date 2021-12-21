import Link from 'next/link'
import { withRouter, NextRouter } from 'next/router'
import styles from './PreNav.module.css'
import React from 'react'

interface WithRouterProps {
  router: NextRouter
  sx?: React.CSSProperties
}

const PreNav = ({ router, sx }: WithRouterProps) => {
  const paths = router.asPath.split('/')

  return (
    <ol className={styles.nav} style={sx}>
      {paths.map((path, index) => (
        <li key={path}>
          <Link href={!index ? '/' : paths.slice(0, index + 1).join('/')}>
            {!index ? 'HOME' : path.toUpperCase()}
          </Link>
        </li>
      ))}
    </ol>
  )
}

export default withRouter(PreNav)
