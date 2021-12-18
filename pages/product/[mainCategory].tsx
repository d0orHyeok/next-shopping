import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'

interface MainCategoryPageParams extends ParsedUrlQuery {
  mainCategory: string
  subCategory: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { mainCategory } = context.params as MainCategoryPageParams

  return {
    props: {},
    redirect: {
      permanent: false,
      destination: `/product/${mainCategory}/all`,
    },
  }
}

const MainCategory = () => {
  return <></>
}

export default MainCategory
