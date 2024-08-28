import { useStyles } from '../views/Styles/HEADER_STYLE';
import ChatIcon from '@mui/icons-material/Chat';
import GroupsIcon from '@mui/icons-material/Groups';
import GroupAddSharpIcon from '@mui/icons-material/GroupAddSharp';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';



const Header = () => {
    const classes = useStyles()
    const navigate = useNavigate()
    const location = useLocation()
    const invalidPaths = ['/login','/register','/*']; // Add all your valid paths here

    if (invalidPaths.includes(location.pathname)) return null;


    const isActive = (page) => {
        return location.pathname.split('/')[1] === page ? true : false
    }
    return (
        <>
            <div className={classes.div} >
              

                <ChatIcon className={`${classes.icon} ${isActive('chat') ? classes.active : ''}`}
                    onClick={() => navigate('/chat')}
                />
                <GroupsIcon className={`${classes.icon} ${isActive('groups') ? classes.active : ''}`}
                    onClick={() => navigate('/groups')}
                />
                <GroupAddSharpIcon className={`${classes.icon} ${isActive('friends') ? classes.active : ''}`}
                    onClick={() => navigate('/friends')}
                />
            </div>
        </>
    )
}
export default Header