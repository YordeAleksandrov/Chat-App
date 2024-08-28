import { makeStyles } from '@mui/styles';



export const useStyles = makeStyles(theme => ({
  card: {
    boxShadow: 20,
    backgroundColor: 'rgba(48, 160, 202, 0.9) !important',
    width: '30%',
    height: '60%',
    alignSelf: 'center',
   
    [theme.breakpoints.down('sm')]: {
      width: '90%',
      height: '50%', 

    },
  },
  div: { 
    display:'flex',
    height: '100vh',
    flexDirection:'column',
    justifyContent:'space-around',
    width: '7%',
    gap:'20px',
    alignItems:'center',
    backgroundColor: 'black',
    [theme.breakpoints.down('sm')]: {
        display: 'flex',
        justifyContent: 'space-around',
        flexDirection:'row',
        alignItems:'center',
        height: '10%',
        width: '100%',
        left: 0,
        bottom: 0, 

        position: 'fixed', 

    }
  },
  icon:{
    fontSize:'40px !important',
    color:'white',
    [theme.breakpoints.up('sm')]: {

        
      }
  },
  active:{
    color: theme.palette.primary.main,
  },
  

}));