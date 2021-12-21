import styles from './AdminProductListPage.module.css'
import { IListPageProps } from 'pages/admin/products/list'
import {
  DataGrid,
  GridRowsProp,
  GridColDef,
  GridRowParams,
} from '@mui/x-data-grid'
import PreNav from '@components/AdminPage/sections/PreNav'
import { useRouter } from 'next/router'

const AdminProductListPage = ({ products }: IListPageProps) => {
  const columns: GridColDef[] = [
    { field: '_id', headerName: 'ID', width: 150 },
    { field: 'name', headerName: '상품명', width: 150 },
    { field: 'category', headerName: '카테고리', width: 150 },
    { field: 'price', headerName: '가격', width: 80 },
    { field: 'colors', headerName: '색상', width: 120 },
    { field: 'fit', headerName: '핏', width: 120 },
  ]

  const rows: GridRowsProp = products.map((product) => {
    return {
      id: product._id,
      _id: product._id,
      name: product.name,
      category: product.category,
      price: product.price,
      colors: product.colors.map((color) => color.colorName),
      fit: product.fit,
    }
  })

  const router = useRouter()

  const handleOnClick = (
    rowData: GridRowParams,
    _: React.MouseEvent<HTMLElement>
  ) => {
    if (confirm('상세조회/수정을 하시겠습니까?')) {
      router.push(`${router.asPath}/${rowData.id}`)
    }
  }

  return (
    <>
      <div className={styles.wrapper}>
        <PreNav
          sx={{ fontSize: '0.9rem', textAlign: 'right', marginBottom: '3rem' }}
        />

        <h1 className={styles.listHead}>
          상품 목록 <span style={{}}>클릭하여 상세조회 및 수정</span>
        </h1>
        <div className={styles.list}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
            disableSelectionOnClick
            onRowClick={handleOnClick}
          />
        </div>
      </div>
    </>
  )
}

export default AdminProductListPage
