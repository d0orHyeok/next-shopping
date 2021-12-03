import CircularProgress from '@mui/material/CircularProgress'

const Loading = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <CircularProgress size="100px" color="inherit" />
    </div>
  )
}

export default Loading
