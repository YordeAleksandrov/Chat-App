import { makeStyles } from '@mui/styles';
import register_background_image from "../../images/8223.jpg_wh1200.jpg";


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
    backgroundImage: `url(${register_background_image})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    display: 'flex',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',

   
  }
}));