import zIndex from '@mui/material/styles/zIndex';
import { makeStyles } from '@mui/styles';
 



export const useStyles = makeStyles(theme => ({
    groupTitle: {
        textAlign: 'center',
        margin: '0px',
        backgroundColor: 'black',
        color: 'white'
    },
    groupSection: {
        display: 'flex',
        flexDirection: 'column',
        width: '20%',
        height: '100vh',
        backgroundColor: 'rgba(3, 37, 50 , 0.3)',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            height: '90%',

        }
    },
    buttonContainer: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-around',
        marginTop: 'auto',
        [theme.breakpoints.down('sm')]:{
            width:'100vw'
        }

    },
    button: {
        backgroundColor: 'black !important',
        width: '45%',
        textAlign: 'center',
        color:'white !important',
        fontSize: '20px !important',
        '&:hover': {
            backgroundColor: 'rgba(210, 109, 254 , 0.2) !important' // Change this to your desired hover color
        }
    },
    modal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '25vw',
        height: '90vh',
        backgroundColor: 'rgba(220, 220, 220, 0.9)',
        border: '2px solid #000',
        borderRadius:'20px',
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.7)',
        padding:'5px',
        display: 'flex', 
        flexDirection:'column',
        alignItems: 'center',
        textAlign: 'center',
        gap:'30px',
        [theme.breakpoints.down('sm')]:{
    width: '100vh',
    height: '70vh'
}
    },
    groupListContainer:{
   
        display:'flex',
        flexDirection:'column',
        width:'100%',
        height:'90vh',
         overflowY: 'auto',
    },
    invitationListContainer:{
        display:'flex',
        flexDirection:'column',
        width:'100%',
        height:'20vh',
         overflowY: 'auto',
    },
    groupField:{
        marginTop:'15px',
        cursor:'pointer',
        display:'flex',
        borderRadius:'7px',
        alignItems:'center',
        width:'98%',
        padding:'2px',
        height:'7vh',
        backgroundColor:'rgba(247, 234, 249, 0.7)',
        '&:hover':{
            backgroundColor:'rgba(117, 134, 249, 0.7)'
        }
    },
    activeField:{
        padding:'2px',
        marginTop:'15px',
        display:'flex',
        alignItems:'center',
        width:'98%',
        height:'7vh',
        backgroundColor:'rgba(117, 134, 249, 0.7)',
    },
    groupName: {
        flex: 0.86,
        textAlign: 'center', 
     fontSize:'22px'
     
      },

    groupListAvatar:{
        width:'15% !important',
        height:'7vh !important'
    }

}));