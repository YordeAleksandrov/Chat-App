import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { useStyles } from "../../views/Styles/Group_Members_Style"
import Avatar from "@mui/material/Avatar"
import { styled } from '@mui/material/styles';
import { useState } from "react";
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Fade from '@mui/material/Fade';
import { Button } from "@mui/material";
import { alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { userSocket } from '../../reducer/middlewares/socketMiddleware';
import { useTranslation } from "react-i18next";
const SmallAvatar = styled(Avatar)(({ theme }) => ({
    width: 15,
    height: 15,
    border: `2px solid ${theme.palette.background.paper}`,
}));
const Search = styled('div')(({ theme }) => ({

    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.7),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.9),
    },
    marginLeft: 0,
    width: '90%',
    height: '8%',
    justifySelf: 'center',
    border: '1px solid black',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(0),

    },
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '100%',

        },
    },
}));
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));
const style = {
    display: 'flex',
    position: 'absolute',
    alignItems: 'center',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'black',
    border: '2px solid #000',
    boxShadow: 24,
};

const GroupMembers = () => {
    const classes = useStyles()
    const user = useSelector(data => data.user.info)
    const members = useSelector(data => data.group.members)
    const group = useSelector(data => data.group.info)
    const { id } = useParams()
    const nav = useNavigate()
    const [searchedUsers, setSearchedUsers] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [invitedUsersId, setInvitedUsersId] = useState([])

    const { t, i18n } = useTranslation()

    //options for members
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);

    //modal
    const [openModal, setOpenModal] = useState(false);
    const modalHandleOpen = () => setOpenModal(true);
    const modalHandleClose = () => {
        setSearchValue('')
        setSearchedUsers([])
        setInvitedUsersId([])
        setOpenModal(false);
    }

    const optionsHandleClick = (event, memberId) => {
        setMenuAnchorEl(event.currentTarget);
        setOpenMenuId(memberId);
    };
    const optionsHandleClose = () => {
        setMenuAnchorEl(null);
        setOpenMenuId(null);
    };
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

    const ownerCheck = (memberId) => {
        if (memberId === group.owner_id) {
            return '👑'
        }
    }
    const handleSearchInput = (value) => {
        setSearchValue(value)

    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            searchForUsers()
        }
    }
    const checkMemberLeaveButton = (memberId) => {
        if (memberId === user.id) {
            return true
        }
        return false
    }
    const searchForUsers = async () => {
        if (!searchValue) return;
        const accessToken = sessionStorage.getItem('accessToken')
        const response = await fetch(`http://localhost:3001/user/searchTerm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                searchTerm: searchValue,
                groupId: id
            })
        });
        if (!response.ok) {
            console.log('failed to fetch')
            return
        }
        const { data, invitedList } = await response.json()
        setInvitedUsersId(invitedList)
        const filteredData = data.filter(data => data.user_id !== user.id)
        setSearchedUsers(filteredData)
    }
    const disableButtonCheck = (userId) => {
        let check = false
        members?.forEach(member => {
            if (member.id === userId) {
                check = true
            }
        })
        invitedUsersId.length > 0 && invitedUsersId.forEach(id => {
            if (id === userId) {
                check = true
            }
        })
        return check

    }
    const inviteButtonText = (userId) => {
        let text = 'Invite'
        invitedUsersId.length > 0 && invitedUsersId.forEach(id => {
            if (id === userId) {
                text = 'Invited'
            }
        })
        return text

    }
    const sendInvite = (userId) => {
        userSocket.send(JSON.stringify({
            type: 'groupInvite',
            userId: userId,
            groupId: id
        }));
        setInvitedUsersId([...invitedUsersId, userId])
    }
    //skip the group=>options property
    const optionsText = (property) => t(`groups.membersOPtions.${property}`);
    //skip the group property
    const text = (property) => t(`groups.${property}`);
    return (
        <div className={classes.container}>
            <div className={classes.membersContainer}>
                {/**header */}
                <div className={classes.header}>
                    <ArrowBackIosIcon

                        onClick={() => nav(`/groups/${id}`)} className={classes.headerBackArrow} />

                    <span className={classes.headerTitle}>{text("Members")}</span>
                </div>

                {/**end of header */}
                {members && <div>
                    {members.map((member) => {

                        const isOwner = ownerCheck(user.id);
                        const memberStatusColor = checkStatusColor(member.status)
                        const isMenuOpen = openMenuId === member.id;
                        return <div key={member.id}
                            className={classes.memberField}>

                            <Avatar alt={member.username} src={member.image_url} />
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                    <SmallAvatar
                                        className={classes.badge}
                                        sx={{ color: memberStatusColor, backgroundColor: memberStatusColor }}
                                        alt="" src="" />}
                            />


                            <span className={classes.personName}>{member.username}{ownerCheck(member.id)}</span>
                            {<IconButton
                                className={classes.optionsButton}
                                aria-label="more"
                                id="long-button"
                                aria-controls={open ? 'long-menu' : undefined}
                                aria-expanded={open ? 'true' : undefined}
                                aria-haspopup="true"
                                onClick={(event) => optionsHandleClick(event, member.id)}
                            >
                                <MoreVertIcon />
                            </IconButton>}

                            <Menu
                                className={classes.optionMenu}
                                key={member.id}
                                id="fade-menu"
                                MenuListProps={{
                                    'aria-labelledby': 'fade-button',
                                }}
                                anchorEl={menuAnchorEl}
                                open={isMenuOpen}
                                onClose={optionsHandleClose}
                                TransitionComponent={Fade}
                            >
                                <MenuItem onClick={optionsHandleClose} className={classes.option}>
                                    {optionsText("Profile")}
                                </MenuItem>
                                <MenuItem onClick={optionsHandleClose} className={classes.option}>
                                    {optionsText("Send Message")}
                                </MenuItem>
                                <MenuItem onClick={optionsHandleClose} className={classes.option}>
                                    {optionsText("Add Friend")}
                                </MenuItem>
                                {checkMemberLeaveButton(member.id) && (
                                    <MenuItem onClick={optionsHandleClose} className={classes.option}>
                                        {optionsText("Leave")}
                                    </MenuItem>
                                )}
                                {isOwner && !checkMemberLeaveButton(member.id) &&
                                    <MenuItem className={classes.option} onClick={optionsHandleClose}>
                                        {optionsText("Make Owner")}
                                    </MenuItem>
                                }
                                {isOwner && !checkMemberLeaveButton(member.id) &&
                                    <MenuItem sx={{ color: 'red' }} onClick={optionsHandleClose}>
                                       {optionsText("Kick")}
                                    </MenuItem>
                                }
                            </Menu>
                        </div>
                    })}
                </div>}
                <div>

                    <Modal
                        keepMounted
                        open={openModal}
                        onClose={modalHandleClose}
                        aria-labelledby="keep-mounted-modal-title"
                        aria-describedby="keep-mounted-modal-description"
                    >
                        <Box sx={style} className={classes.modal}>
                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    onKeyDown={handleKeyDown}
                                    placeholder={text("Search by name…")}
                                    inputProps={{ 'aria-label': 'search' }}
                                    onChange={(e) => handleSearchInput(e.target.value)}
                                    value={searchValue}
                                />

                            </Search>
                            <Button
                                onClick={searchForUsers}
                                sx={{ marginTop: '5px', marginBottom: '15px', backgroundColor: 'purple' }} variant="contained">{text("Search")}</Button>
                            <div className={classes.searchedContainer}>
                                {searchedUsers.map((user, index) => {
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
                                            onClick={() => sendInvite(user.user_id)}
                                            variant="outlined">{text(inviteButtonText(user.user_id))}</Button>


                                    </div>)
                                })}
                            </div>
                        </Box>
                    </Modal>
                </div>
            </div>
            <Button onClick={modalHandleOpen} className={classes.addButton}>{text("Add")}</Button>
        </div>

    )
}
export default GroupMembers