import { makeStyles } from '@mui/styles';



export const useStyles = makeStyles(theme => ({
    tabBox: {
        width:'100%',
    },
    tab: {
        width: '33.33% !important',
        maxWidth: '100%  !important',
        backgroundColor: 'rgba(220, 219, 220,0.7) !important',
        padding: '0px !important',
        margin: '0px ',
        borderBottom: '8px solid !important'
    },
    card: {

        [theme.breakpoints.down('sm')]: {
            width: '90%',
            height: '50%',

        },
    },
    addBox: {
        display: 'flex',
        width: '40%',
        marginTop:'20px',
        height: '80%',
 
        backgroundColor: 'rgba(203, 184, 211,0.7)',
        flexDirection: 'column',
        alignSelf:'center',
        justifySelf:'center',
        alignItems: 'center' ,
        [theme.breakpoints.down('sm')]: {
            width: '90%',
            height: '80%',

        },
    },
    searchedContainer:{
        display:'flex',
        flexDirection:'column',
        width:'90%',
        height:'70%',
        marginTop:'30px',
    },
    memberField: {
        display: 'flex',
        alignItems: 'center',
        borderRadius:'20px',
        marginTop: '15px',
        cursor: 'pointer',
        width: '98%',
        padding: '2px',
        height: '7vh',
        backgroundColor: 'rgba(247, 234, 249, 0.7)',
        
      },
      personName: {
        flex: 0.9,
        textAlign: 'center !important',
      },

}));