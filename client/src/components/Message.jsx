import { Avatar, Button, Card, Divider, TextField } from "@mui/material"
import { useStyles } from "../views/Styles/Message_STYLE"
import { useSelector } from "react-redux"
import { useState } from "react"
import emptyFile from '../images/empthyFilepng.png'
import Picker from '@emoji-mart/react'
import AddReactionIcon from '@mui/icons-material/AddReaction';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import DeleteIcon from '@mui/icons-material/Delete';
import { groupSocket } from '../reducer/middlewares/socketMiddleware';
import { useParams } from "react-router-dom"


const Message = ({ msg, lastMessage }) => {
  const classes = useStyles()
  const user = useSelector(data => data.user.info)
  const [isHovered, setIsHovered] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false)
  const [edit, setEdit] = useState(false)
  const [newContent, setNewContent] = useState('')
  const { id } = useParams()

  const lastMsgDate = new Date(lastMessage.created_at).toDateString()
  const currentMsgDate = new Date(msg.created_at).toDateString();
  const date = new Date(msg.created_at);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const formattedTime = `${hours}:${minutes}`;

  const dateDivider = (date) => {
    const currentDate = new Date();
    const providedDate = new Date(date);

    const isToday = currentDate.toDateString() === providedDate.toDateString();

    const yesterday = new Date(currentDate);
    yesterday.setDate(currentDate.getDate() - 1);
    const isYesterday = yesterday.toDateString() === providedDate.toDateString();

    if (isToday) {
      return "Today";
    } else if (isYesterday) {
      return "Yesterday";
    } else {
      return providedDate.toLocaleDateString();
    }
  };
  ;
  const lastMsgTime = new Date(lastMessage.created_at);
  const currentMsgTime = new Date(msg.created_at);
  const timeDifference = (currentMsgTime - lastMsgTime) / 1000 / 60; // Time difference in minute


  const deleteMsg = () => {
    groupSocket.send(JSON.stringify({
      type: 'deleteMessage',
      id: msg.id,
      groupId: id
    }));
  }
  const handleConfirmEdit = () => {
    groupSocket.send(JSON.stringify({
      type: 'editMessage',
      id: msg.id,
      groupId: id,
      content: newContent
    }));
    setEdit(false)
  }
  //Remove Emoji
  const handleRemoveReaction = async (emoji) => {
    console.log('emoji')
    groupSocket.send(JSON.stringify({
      type: 'removeReaction',
      messageId: msg.id,
      userId: user.id,
      username: user.name,
      emoji: emoji,
      groupId: id
    }));
  }
  //Add Emoji
  const handleAddReaction = async (emoji) => {
    let checkIfExists = false
    if (msg.reactions) {
      if (msg.reactions[emoji]?.length > 0) {
        msg.reactions[emoji].map((react) => {
          if (react.userId === user.id) {
            checkIfExists = true
          }
        })
      }
    }
    if (checkIfExists) {
      console.log(checkIfExists)
      handleRemoveReaction(emoji)
      return
    }
    groupSocket.send(JSON.stringify({
      type: 'addReaction',
      messageId: msg.id,
      userId: user.id,
      username: user.name,
      emoji: emoji,
      groupId: id
    }));
  }
  //on selected emoji click -add/remove
  const clickOnListedEmoji = (emoji) => {
    handleAddReaction(emoji)
  }

  //check if emoji is selected by user
  const checkIfUserHasEmoji = (emoji) => {
    let check = false
    msg.reactions[emoji]?.map(u => {

      if (u.userId === user.id) {
        check = true
      }
    })
    if(check){
      return`rgba(254, 254, 149)`
    }
    return''
  }
const showMsgHeader=()=>{
  if(timeDifference >= 1){
    return true
  }
  else if (lastMessage.sender_id!==msg.sender_id){
    return true
  }

  return false
}
  return (
    <>
      {lastMsgDate !== currentMsgDate && <Divider className={classes.msgDivider}>{dateDivider(currentMsgDate)}</Divider>}
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={user.id === msg.sender_id ? classes.sender : classes.receiver}>

        {showMsgHeader()&&<div className={classes.msgHeader}>
          <Avatar
            className={classes.headerAvatar}
            alt={msg.sender_username}
            src={msg.sender_image_url}
          >{msg.sender_username?.toUpperCase()[0]}
          </Avatar>


          <h3 className={classes.headerName}>{msg.sender_username === user.username ? 'Me' : msg.sender_username}</h3>
          <span className={classes.headerDate}>{formattedTime}</span>
        </div>}
        <div className={classes.msgContent}>


          {/**msg content */}
          {!edit ? <span className={classes.msgText}>{msg.content}</span>
            :
            <div className={classes.editForm}>
              <TextField
                onChange={(e) => setNewContent(e.target.value)}
                defaultValue={msg?.content}></TextField>
              <div>
                <Button
                  sx={{ color: 'black' }}
                  onClick={() => setEdit(false)}
                >Cancel</Button>
                <Button
                  sx={{ color: 'black' }}
                  onClick={handleConfirmEdit}
                >Confirm</Button>
              </div>
            </div>}


          {msg.files?.map((f, index) => {
            const filePath = f.type === 'image' ? `http://localhost:3001/${f.path.replace(/\\/g, '/')}` : emptyFile;
            const fileName = f.path.split('\\').pop().replace(/^\d+[-_]/, '');
            return (
              <div key={index} className={classes.imageBox}>
                <Divider className={classes.divider} />
                <img className={classes.msgImage} src={filePath} alt="img" />
                <a href={filePath} download={fileName}><span>{fileName}</span></a>
              </div>

            )
          })}
          <div className={classes.reactionList}>
            {msg.reactions&&Object.keys(msg.reactions).map((emoji, index) => {
              return msg.reactions[emoji].length > 0
                &&
                <span
                  onClick={() => { clickOnListedEmoji(emoji) }}
                  key={index}
                  style={{
                    fontSize: '20px',
                    margin: '6px',
                    border: '1px solid black',
                    borderRadius: '30%',
                    backgroundColor: `${checkIfUserHasEmoji(emoji)}`
                  }}>
                  {`${emoji}`}
                  <span
                    style={{ fontSize: '14px' }}
                  >{msg.reactions[emoji].length}</span>
                </span>
            })

            }
          </div>
        </div>
        {isHovered && (
          <div className={`${classes.reactionOptions} ${isHovered ? 'show' : ''}`}>
            <AddReactionIcon
              onClick={(e) => {
                e.stopPropagation()
                setShowEmoji(true)
              }}
            />
            {msg.sender_id === user.id
              &&
              <BorderColorIcon
                onClick={() => { setEdit(true) }} />}
            {msg.sender_id === user.id
              &&
              <DeleteIcon onClick={deleteMsg} />}
          </div>

        )}
        {showEmoji &&
          <div className={classes.msgEmojiPicker}
          ><Picker
              onEmojiSelect={(e) => {
                handleAddReaction(e.native)
              }}
              onClickOutside={() => {
                setShowEmoji(false)
              }} /></div>}
      </Card>
    </>
  )
}
export default Message