import { useStyles } from '../views/Styles/HEADER_STYLE';
import ChatIcon from '@mui/icons-material/Chat';
import GroupsIcon from '@mui/icons-material/Groups';
import GroupAddSharpIcon from '@mui/icons-material/GroupAddSharp';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from '@mui/material';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { disconnectUserSocket, USER_SOCKET_DISCONNECT } from '../reducer/actions/USER_ACTIONS';
import { disconnectGroupSocket, GROUP_SOCKET_DISCONNECT } from '../reducer/actions/GROUP_ACTIONS';



const Header = () => {
    const classes = useStyles()
    const navigate = useNavigate()
    const location = useLocation()
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const user=useSelector(data=>data.user.info)
    const dispatch=useDispatch()
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
   
    const invalidPaths = ['/login', '/register', '/*']; // Add all your valid paths here

    if (invalidPaths.includes(location.pathname)) return null;


    const isActive = (page) => {
        return location.pathname.split('/')[1] === page ? true : false
    }
    const handleLogout=()=>{
        handleClose()
        sessionStorage.removeItem('accessToken')
        sessionStorage.removeItem('userId')
        dispatch(disconnectUserSocket())
        dispatch(disconnectGroupSocket())
        
        navigate('/login')
    }

    return (
        <>
            <div className={classes.div} >
                <>
                <Box >
                    <Tooltip title="Account settings">
                        <IconButton
                            onClick={handleClick}
                            size="small"
                            sx={{ ml: 0 }}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                        >
                            <Avatar sx={{ width: 44, height: 44 }}>{user.image_url||''}</Avatar>
                        </IconButton>
                    </Tooltip>
                </Box>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    slotProps={{
                        paper: {
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                   
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&::before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={handleClose}>
                     Profile
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <Settings fontSize="small" />
                        </ListItemIcon>
                        Settings
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </>
            

            <ChatIcon className={`${classes.icon} ${isActive('chat') ? classes.active : ''}`}
                onClick={() => navigate('/chat')}
            />
            <GroupsIcon className={`${classes.icon} ${isActive('groups') ? classes.active : ''}`}
                onClick={() => navigate('/groups')}
            />
            <GroupAddSharpIcon className={`${classes.icon} ${isActive('friends') ? classes.active : ''}`}
                onClick={() => navigate('/friends')}
            />
        </div >
        </>
    )
}
export default Header