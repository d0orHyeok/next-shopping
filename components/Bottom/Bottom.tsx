import styles from './Bottom.module.css'
import classnames from 'classnames/bind'
const cx = classnames.bind(styles)

import YouTubeIcon from '@mui/icons-material/YouTube'
import TwitterIcon from '@mui/icons-material/Twitter'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'

import Link from 'next/link'

const Bottom = () => {
  return (
    <footer className={cx('footer')}>
      <div className={cx('container')}>
        <section className={cx('nav')}>
          <div className={cx('nav-container')}>
            <div className={cx('introduce')}>
              <ul>
                <li className={cx('nav-title')}>
                  <Link href="/scenter/about">브랜드소개</Link>
                </li>
                <li className={cx('nav-title')}>
                  <Link href="/scenter/store">매장안내</Link>
                </li>
              </ul>
            </div>
            <div className={cx('serviceCenter')}>
              <h2 className={cx('nav-title')}>고객센터</h2>
              <ul>
                <li>
                  <a href="tel:000-0000-0000">000-0000-0000</a>
                </li>
                <li>
                  <a
                    href="mailto:d0oR.hyeok@gmail.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    1:1 이메일문의
                  </a>
                </li>
                <li>
                  <Link href="/scenter/policy">이용약관</Link>
                </li>
                <li>
                  <Link href="/scenter/privacyAndTerms">개인정보처리방침</Link>
                </li>
              </ul>
            </div>
            <div className={cx('about')}>
              <h2 className={cx('nav-title')}>ABOUT PIIC</h2>
              <ul>
                <li>
                  <Link href="/scenter/about">PIIC에 대하여</Link>
                </li>
              </ul>
            </div>
            <div className={cx('social')}>
              <h2 className={cx('nav-title')}>SOCIAL</h2>
              <ul>
                <li>
                  <a
                    target="_blank"
                    href="https://www.youtube.com/"
                    rel="noreferrer"
                  >
                    <YouTubeIcon />
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://twitter.com/"
                    rel="noreferrer"
                  >
                    <TwitterIcon />
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://www.facebook.com/"
                    rel="noreferrer"
                  >
                    <FacebookIcon />
                  </a>
                </li>
                <li>
                  <a
                    target="_blank"
                    href="https://www.instagram.com/"
                    rel="noreferrer"
                  >
                    <InstagramIcon />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section className={cx('copy')}>
          <h3>
            Copyright by PIIC All Right Reserved.
            <span>JangHyeok Kim</span>
          </h3>
        </section>
        <section className={cx('info')}>
          <div className={cx('info-container')}>
            <p>
              (주)Shop<span> | </span>사업자등록번호 : 000-00-000000
            </p>
            <p>
              대표이사:Name/Name<span> | </span>서울특별시 00구 00로 00
            </p>
          </div>
        </section>
      </div>
    </footer>
  )
}

export default Bottom
