import { Button, TextField } from "@mui/material"
import { useStyles } from "../../views/Styles/GROUPS_STYLE"
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import addImage from "../../images/addImage.png";
import { groupValidation } from "../../validations/group_validations";
import NativeSelect from '@mui/material/NativeSelect';
import { useDispatch, useSelector } from "react-redux";
import { removeGroupInvitation, toggleLoader } from "../../reducer/actions/USER_ACTIONS";
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router';
import { useParams } from "react-router-dom";
import { handleImageChange } from "../../helpers/uploadImage"
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import IconButton from '@mui/material/IconButton';
import { groupSocket, userSocket } from "../../reducer/middlewares/socketMiddleware"
import { useTranslation } from "react-i18next";



const GroupsListMenu = () => {


  const dispatch = useDispatch()
  const user = useSelector(data => data.user.info)
  const groupInvites = useSelector(data => data.user.groupInvites || null)
  const nav = useNavigate()
  const classes = useStyles()
  const [open, setOpen] = useState(false);
  const [groups, setGroups] = useState(null)
  const { id } = useParams()
  const [selectedImage, setSelectedImage] = useState('')
  const { t, i18n } = useTranslation()
  const [groupData, setGroupData] = useState({
    name: '',
    image: '',
    description: '',
    privacy: 'public'
  })
  const [error, setError] = useState({
    check: false,
    type: ''
  });
  useEffect(() => {
    if (!user) {
      return
    }
    (async () => {
      const accessToken = sessionStorage.getItem('accessToken')
      const response = await fetch(`http://localhost:3001/group/${user.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (!response.ok) {
        console.log('failed to fetch')
        return
      }
      const data = await response.json()
      setGroups(data)
    })()
  }, [user])

  //skip the group property
  const text = (property) => t(`groups.${property}`);



  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false)
    setError('')
    setSelectedImage({})
    setGroupData({
      name: '',
      image: '',
      description: '',
      privacy: 'public'
    })
  };
  const changeCurrentImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setSelectedImage({ file: file, url: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    document.getElementById('fileInput').click();
  };
  const handleInputChange = (field, data) => {
    console.log(data)
    setGroupData({ ...groupData, [field]: data })
  }
  const handleCreate = async () => {
    const errorCheck = groupValidation(groupData.name)
    setError(errorCheck)
    if (errorCheck.check) return
    try {
      dispatch(toggleLoader(true))

      const newPath = handleImageChange(selectedImage.file)
      const path = selectedImage.file ? await handleImageChange(selectedImage.file) : ''
      const newGroup = {
        id: uuidv4(),
        name: groupData.name,
        description: groupData.description,
        image_url: path,
        created_at: new Date(),
        privacy: groupData.privacy,
        owner_id: user.id
      }
      const accessToken = sessionStorage.getItem('accessToken')
      const response = await fetch('http://localhost:3001/group/create', {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        credentials: 'include',
        body: JSON.stringify(newGroup)
      });
      if (response.ok) {
        setGroups([...groups, newGroup])
      }
      dispatch(toggleLoader(false))
      setOpen(false)
      setError('')
      setGroupData({
        name: '',
        image: '',
        description: '',
        privacy: 'public'
      })
      setSelectedImage({})
    } catch (err) {
      console.log(err)
      dispatch(toggleLoader(false))
    }
  }
  const handleAcceptInvitation = (invitationId, groupId, invite) => {
    dispatch(removeGroupInvitation(invitationId))
    setGroups([...groups, { id: invite.group_id, name: invite.name, image_url: invite.image_url }])
    userSocket.send(JSON.stringify({
      type: 'acceptInvite',
      groupId: groupId,
      invitationId,
      member: {
        username: user.username,
        status: user.status,
        id: user.user_id,
        image_url: user.image_url
      }

    }));
    nav(`/groups/${groupId}`)
  }
  const handleDeclineInvitation = (invitationId) => {
    console.log(invitationId)
    dispatch(removeGroupInvitation(invitationId))
    const accessToken = sessionStorage.getItem('accessToken')
    fetch('http://localhost:3001/group/declineInvitation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        invitationId
      })
    })
  }
  return (
    <div className={classes.groupSection}>
      {groupInvites.length > 0 && <h2 className={classes.groupTitle}>{text('Invites')}</h2>}
      {groupInvites.length > 0 && <div className={classes.invitationListContainer}>
        {groupInvites.map((invite) => {
          return <div
            key={invite.invitation_id}
            onClick={() => nav(`/groupInfo/${invite.group_id}`)}
            className={classes.groupField}>

            <Avatar className={classes.groupListAvatar}
              alt={invite.name}
              src={`http://localhost:3001${invite.image_url}`}>
              {invite.name[0]}</Avatar>
            <span className={classes.groupName}>{invite.name}</span>
            <div>
              <IconButton onClick={(e) => {
                e.stopPropagation()
                handleAcceptInvitation(invite.invitation_id, invite.group_id, invite)
              }}>
                <CheckIcon />
              </IconButton>
              <IconButton onClick={(e) => {
                e.stopPropagation()
                handleDeclineInvitation(invite.invitation_id, invite.group_id)
              }}>
                <CloseIcon />
              </IconButton>
            </div>
          </div>
        })}
      </div>}
      <h2 className={classes.groupTitle}>{text("Groups")}</h2>
      {groups && <div className={classes.groupListContainer}>
        {groups.map((group) => {
          return <div
            onClick={() => nav(`/groups/${group.id}`)}
            className={id === group.id ? classes.activeField : classes.groupField} key={group.id}>
            <Avatar className={classes.groupListAvatar}
              alt={group.name}
              src={`http://localhost:3001${group.image_url}`}>
              {group.name[0]}</Avatar>
            <span className={classes.groupName}>{group.name}</span>
          </div>
        })}
      </div>}
      <div className={classes.buttonContainer}>
        <Button className={classes.button}
          onClick={() => nav('/join-group')}>{text("Join")}</Button>
        <Button className={classes.button}
          onClick={handleOpen}>{text("Create")}</Button>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={classes.modal}>
          <Avatar
            onClick={handleAvatarClick}
            alt="None"
            src={selectedImage?.url ? selectedImage.url : addImage}
            sx={{ width: 120, height: 120, marginTop: '10px', cursor: 'pointer' }}
          />
          <div>
            <TextField
              onChange={e => handleInputChange('name', e.target.value)}
              error={error.check}
              required
              value={groupData.name}
              id="outlined-required"
              label={text("Group Name")}

            />
            {error.type && <h4 style={{ marginTop: '2px', marginBottom: '0px', color: 'red' }}>{text(error.type)}</h4>}
          </div>
          <TextField
            onChange={e => handleInputChange('description', e.target.value)}
            value={groupData.description}
            id="outlined"
            label={text("Description")}
          />
          <NativeSelect
            onChange={(e) => handleInputChange('privacy', e.target.value)}
            defaultValue={groupData.privacy}
          >
            <option value={'public'}>{text("Public")}</option>
            <option value={'private'}>{text("Private")}</option>
          </NativeSelect>
          <div className={classes.buttonContainer}>
            <Button className={classes.button}
              onClick={handleCreate}>{text("Create")}</Button>
            <Button className={classes.button}
              onClick={handleClose}>{text("Cancel")}</Button>
          </div>
          <input
            type="file"
            accept="image/*"
            id="fileInput"
            style={{ display: 'none' }}
            onChange={changeCurrentImage}
          />

        </Box>
      </Modal>
    </div>
  )
}
export default GroupsListMenu