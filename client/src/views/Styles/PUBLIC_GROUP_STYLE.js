import zIndex from '@mui/material/styles/zIndex';
import { makeStyles } from '@mui/styles';
 



export const useStyles = makeStyles(theme => ({
    field: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        height: '100%',
        overflowY: 'auto',

        [theme.breakpoints.down('sm')]: {
            height: '90vh',

        },
    },
    publicCard:{
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        width:'20%',
        height:'30vh',
        margin: '0 6%', // No vertical margin, 17% horizontal margin divided by 2
        background:'rgba(201, 169, 197,0.7) !important',
        [theme.breakpoints.down('sm')]:{
            marginBottom:'20px',
            height:'30vh',
            width:`100%`
        }
    },
    image:{
        width:'70%',
        height:'50%',
        backgroundSize:'cover !important'
    },
    button:{
        backgroundColor:'rgba(103, 94, 230,0.3) !important',
        color:'black !important'
    }
    


}));