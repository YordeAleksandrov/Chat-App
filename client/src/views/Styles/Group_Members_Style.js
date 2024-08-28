import { makeStyles } from '@mui/styles';

export const useStyles=makeStyles(theme=>({
  container:{
    display:'flex',
    flexDirection:'column',
   width:'20%',
   height:'100%',
   [theme.breakpoints.down('sm')]:{
    width:'100%',
    height:'90%'
  }
  },
  header: {
    display: 'flex',
    width: '100%',
    height: '5%',
    background: 'black',

    alignItems: 'center',
    [theme.breakpoints.down('sm')]:{
      height:'10%'
    }

},
  headerTitle: {
    flex: 0.9,
    alignSelf: 'center',
    textAlign: 'center',
    color: 'white',
    fontSize: '25px'
},
  membersContainer:{
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(130, 37, 50 , 0.3)',
    overflow: 'auto'
    
   
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
  headerBackArrow: {
    color: 'white',
    fontSize: '35px !important',
    marginLeft: '10px',
    [theme.breakpoints.up('sm')]: {
        display: 'none !important'
    }
},
  badge: {
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    position: 'absolute',
    width: '10px !important',
    height: '10px !important',
    bottom: -10,
    left: 0,
    borderRadius: '50%',
    border: 'none !important',
    content: '""',
  },
  personName: {
    flex: 0.9,
    textAlign: 'center !important',
  },
addButton:{
  width:'100%',
  height:'7%',
  marginTop:'auto !important',
  backgroundColor:'black !important',
  color:'white!important'
},
modal:{
  display:'flex',
  flexDirection:'column',
  height:'60%',
  width:'50%',
  justifyContent:'center'
},
searchedContainer:{
  display:'flex',
  flexDirection:'column',
  width:'90%',
  height:'70%',
  marginBottom:'30px',
  border:'1px solid black'
  
},
option: {
  borderBottom: '2px solid black !important',
}


}))