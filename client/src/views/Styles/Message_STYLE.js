import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles((theme) => ({
  sender: {
    position: 'relative',
    alignSelf: 'flex-end',
    width: '40%',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    alignItems: 'flex-start',
    padding: '5px',
    backgroundColor: 'rgba(145, 163, 252,0.6 )!important',
    margin: '0px'
  },
  receiver: {
    position: 'relative',
    alignSelf: 'flex-start',
    width: '40%',
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    alignItems: 'flex-start',
    padding: '5px',
    backgroundColor: 'rgba(205, 183, 252,0.6 )!important'
  },
  msgHeader: {
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  headerDate: {
    marginLeft: 'auto'
  },
  headerName: {
    margin: '0px',
    fontSize: '20px',
  },
  msgContent: {
    width: '100%',
    minHeight: '55px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '800%',
  },
  msgImage: {
    width: '80%',
    height: '200px',
    objectFit: 'contain',
    flexShrink: 0
  },
  divider: {
    width: '80%',
    background: 'black',
    margin: '10px!important'
  },
  msgText: {
    alignSelf: 'flex-start',
    wordWrap: 'break-word',
    whiteSpace: 'normal',
    maxWidth: '100%',
  },
  reactionOptions: {
    display: 'flex',
    
    bottom:0,
    left:0,
    gap: '25px',
    justifyContent: 'center',
    width: '100%',
    padding: '10px',
    backgroundColor: 'rgba(0,0,0,0.02)',
 
  },
  msgEmojiPicker: {
    height: '400px', // Fixed height
    width: '400px', // Fixed width
    position: 'fixed', // Position relative to the viewport
    top: '50%', // Center vertically
    left: '50%', // Center horizontally
    transform: 'translate(-50%, -50%)', // Center the element
    zIndex: 1001, // Ensure it's on top of other elements
},
    emojiCircle: {
      padding: '20px'
    },
  }));