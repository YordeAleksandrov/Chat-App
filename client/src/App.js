
import { Route, Routes } from 'react-router';
import Loader from './components/Loader';
import Login from './views/Login';
import Register from './views/Register';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUserAction, toggleLoader, USER_SOCKET_CONNECT } from './reducer/actions/USER_ACTIONS';
import { useNavigate } from 'react-router-dom';
import Header from './components/Header';
import ErrorPage from './views/ErrorPage';
import Groups from './views/Groups';
import { jwtDecode } from "jwt-decode";
import './index.css'
import { ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import GroupChat from './components/group-components/GroupChat';
import PublicGroups from './views/PublicGroups';
import GroupMembers from './components/group-components/GroupMembers';
import './i18n/i18n'

const theme = createTheme();

function App() {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch()
  const navigate=useNavigate()
  const user=useSelector(data=>data.user.info)
  useEffect(() => {
    const userId = sessionStorage.getItem('userId')

    dispatch(toggleLoader(true))
    if (userId &&!user?.id) {
      dispatch(loginUserAction(JSON.parse(userId)))

     

    }else if(!userId &&!user?.id){
      navigate('/login')
    } 
   
      dispatch(toggleLoader(false))

  },[])
  useEffect(()=>{
   
if(user.id){
 sessionStorage.setItem('userId',JSON.stringify(user.id))
}
  },[user])
  useEffect(()=>{
    if(!user?.id)return
    let intervalId = setInterval(async() => {
      const accessToken=sessionStorage.getItem('accessToken')
      const decodedToken=jwtDecode(JSON.parse(accessToken))  
      const currentTime=new Date()/1000
      if(decodedToken.exp<currentTime){
        console.log('token expired ')
        const response= await fetch('http://localhost:3001/token', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: 'include'
      })
      if(!response.ok){
        navigate('/login')
        return
      }
      const newAccessToke=await response.json()
      sessionStorage.setItem('accessToken',JSON.stringify(newAccessToke))
      }
    },20000);

    return(() => {
        clearInterval(intervalId)
    })
},[user]);

  return (
     <div className="flex-container">
    <Header/>
      <Loader />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/*'element={<ErrorPage/>}/>
        <Route path='/groups' element={<Groups/>}/>
        <Route path='/join-group' element={<PublicGroups/>}/>
        <Route path='/groups/:id' element={isSmallScreen?(<GroupChat/>):(<Groups/>)}/>
        <Route path='/groups/:id/:page' element={isSmallScreen?(<GroupMembers/>):(<Groups/>)}/>
      </Routes>
      </div>
  );
}
export default App;
