import styles from './Bottom.module.css'
import classnames from 'classnames/bind'

import YouTubeIcon from '@mui/icons-material/YouTube'
import TwitterIcon from '@mui/icons-material/Twitter'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'

const cx = classnames.bind(styles)

const Bottom = () => {
  return (
    <footer className={cx('footer')}>
      <div className={cx('container')}>
        <section className={cx('nav')}>
          <div className={cx('nav-container')}>
            <div className={cx('introduce')}>
              <ul>
                <li className={cx('nav-title')}>브랜드소개</li>
                <li className={cx('nav-title')}>매장안내</li>
              </ul>
            </div>
            <div className={cx('serviceCenter')}>
              <h2 className={cx('nav-title')}>고객센터</h2>
              <ul>
                <li>000-0000-0000</li>
                <li>1:1 이메일문의</li>
                <li>이용약관</li>
                <li>개인정보처리방침</li>
              </ul>
            </div>
            <div className={cx('about')}>
              <h2 className={cx('nav-title')}>ABOUT PIIC</h2>
              <ul>
                <li>PIIC에 대하여</li>
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
