import { useSelector } from 'react-redux'
import { CircularProgress, Box } from '@mui/material'

const Loader = () => {

    const isLoading = useSelector(state => state.loader.isLoading)
    return (
        isLoading && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(20, 0, 0, 0.6)', // Shadow effect
                zIndex: 1000, // Ensure it's above other content
              }}
            >
              <CircularProgress thickness={2} style={{width:"180px",height:'180px'}} />
            </Box>
          )
    )
}
export default Loader