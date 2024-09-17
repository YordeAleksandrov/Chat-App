import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { useStyles } from './Styles/FRIENS_STYLE';
import { useTranslation } from 'react-i18next';
import { TextField } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import { useSelector } from "react-redux"
import Badge from '@mui/material/Badge';
import Avatar from "@mui/material/Avatar"
import { Button } from "@mui/material";
import { styled } from '@mui/material/styles';


const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 15,
    height: 15,
    border: `2px solid ${theme.palette.background.paper}`,
}));

const Friends = () => {
    const classes = useStyles()
    const [tabValue, setTabValue] = useState('friends');
    const [searchValue,setSearchValue]=useState('')
    const { t, i18n } = useTranslation()
    const user=useSelector(data=>data.user.info)
    const friends=useSelector(data=>data.user.friends)
    const friendInvites=useSelector(data=>data.user.friendInvites)
    const [searchUsers,setSearchUser]=useState([])
    const [invitedUsers,setInvitedUsers]=useState([])
    
    const handleChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const handleKeyPress =(e)=>{
        if(e.key==='Enter'){
            searchForUsers()
            e.preventDefault()
            e.stopPropagation()

        }
        
    }
    const searchForUsers = async () => {
        if (!searchValue) return;
        const accessToken = sessionStorage.getItem('accessToken')
        const response = await fetch(`http://localhost:3001/user/searchTermFriends`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                searchTerm: searchValue,
                userId:user.id

              
            })
        });
        if (!response.ok) {
            console.log('failed to fetch')
            return
        }
        const {data,invitedList}=await response.json()
        setSearchUser(data)
        setInvitedUsers(invitedList)
    }
    const text = (message) => t(`friends.${message}`)

    const disableButtonCheck = (userId) => {
        let check = false
        friends?.forEach(member => {
            if (member.id === userId) {
                check = true
            }
        })
        invitedUsers.length > 0 && invitedUsers.forEach(id => {
            if (id === userId) {
                check = true
            }
        })
        return check

    }
    const inviteButtonText = (userId) => {
        let textBtn = text('add')
        invitedUsers.length > 0 && invitedUsers.forEach(id => {
            if (id === userId) {
                textBtn = text('invited')
            }
        })
        friends.forEach(f=>{
            if(f.id===userId){
                textBtn=text('friends')
            }
        })
        return textBtn

    }
    const checkStatusColor = (status) => {
        switch (status) {
            case 'online':
                return 'rgba(40, 250, 49)'

            case 'offline':
                return 'rgba(211, 221, 211)'

            default:
                return ''
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
            <Box className={classes.tabBox}>
                <Tabs
                    sx={{ width: '100%', gap: '10px' }}
                    value={tabValue}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                >
                    <Tab className={classes.tab} value="friends" label={text('friends')} />
                    <Tab className={classes.tab} value="invitations" label={text('invitations')+`(${friendInvites.length})`} />
                    <Tab className={classes.tab} value="add" label={text('add')} />
                </Tabs>
            </Box>
            {/* case ADD */}
            {tabValue === "add" &&
                <div className={classes.addBox}>
                    <FormControl
                    sx={{marginTop:'5px'}}
                     variant="standard">
                        <InputLabel htmlFor="input-with-icon-adornment">
                           {text('searchBy')}
                        </InputLabel>
                        <Input
                        onChange={(e)=>setSearchValue(e.target.value)}
                        onKeyDown={e=>handleKeyPress(e)}
                        value={searchValue}
                            id="input-with-icon-adornment"
                            endAdornment={
                                <InputAdornment position="start">
                                    <SearchIcon
                                    onClick={searchForUsers} />
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    <div className={classes.searchedContainer}>
                    {searchUsers.map((user, index) => {
                                    const memberStatusColor = checkStatusColor(user.status)
                                    return (<div key={index}
                                        className={classes.memberField}>

                                        <Avatar alt={user.username} src={user.image_url} />
                                        <Badge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                            badgeContent={
                                                <SmallAvatar
                                                    className={classes.badge}
                                                    sx={{ color: memberStatusColor, backgroundColor: memberStatusColor }}
                                                    alt="" src="" />}
                                        />


                                        <span className={classes.personName}>{user.username}</span>
                                        <Button
                                            disabled={disableButtonCheck(user.user_id)}
                                            onClick={() => {}}
                                            variant="outlined">{(inviteButtonText(user.user_id))}</Button>


                                    </div>)
                                })}
                                </div>
                </div>
            }
        </div>
    );
};

export default Friends