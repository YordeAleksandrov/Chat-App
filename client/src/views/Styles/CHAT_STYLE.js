import { makeStyles } from '@mui/styles';


export const useStyles = makeStyles(theme => ({
    fieldContainer: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '50%',
        position: 'relative',
        backgroundColor: 'rgba(1,1,1,0.4) !important',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            height: '90%',

        }
    },
    header: {
        display: 'flex',
        width: '100%',
        height: '10%',
        background: 'black',

        alignItems: 'center'

    },
    headerTitle: {
        flex: 0.9,
        alignSelf: 'center',
        textAlign: 'center',
        color: 'white',
        fontSize: '25px'
    },
    headerBackArrow: {
        color: 'white',
        fontSize: '35px !important',
        marginLeft: '10px',
        [theme.breakpoints.up('sm')]: {
            display: 'none !important'
        }
    },
    chatField: {
        alignSelf: 'center',
        justifySelf: 'center',
        display: 'flex',
        width: '80%',
        height: '80%',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255,0.7) !important',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        }
    },
    chatBox: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width:'100%',
        gap:'3px',
        overflowY: 'auto', 
        padding: '10px', 
        boxSizing: 'border-box',
    },
    chatInputField: {
        border: '7px solid black',
        p: '22px 42px',
        display: 'flex',
        alignSelf: 'center',
        alignItems: 'center',
        width: "80%",
        borderRadius: '0px !important',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
      
    },
    emojiDiv: {
        position: 'absolute',
        bottom: '10%',
        right: '10%', 
        zIndex: 1000,
        [theme.breakpoints.down('sm')]: {
            right: '0',
        },

    },
    selectedFiles: {
        marginTop: 'auto',
        display: 'flex',
        position:'absolute',
        bottom:'10%',
        backgroundColor: 'white',
        gap:'10px',
        height: '18%',
        width: '100%',
        overflow: 'auto',
        background:'rgba(0,0,0,0.5) !important'
    },
    fileBox:{
        display:'flex',
        flexDirection:'column',
    width:'13%',
    height:'100%',

    },
    fileImage:{
        width:'100%', 
        height:'60%',
        margin:'0px !important'

    },
    typingField: {
        position: 'absolute',
        bottom:'10%',
        right:'12.3%',
        width: '77.7%',
        height: '4%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        [theme.breakpoints.down('sm')]: {
            width: '100%',
            right:'0'
        }
    }
})); 