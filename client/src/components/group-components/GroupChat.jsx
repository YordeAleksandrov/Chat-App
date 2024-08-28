
import { Card, CardContent, CardMedia } from "@mui/material"
import { useStyles } from "../../views/Styles/CHAT_STYLE"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { connectGroupSocket } from "../../reducer/actions/GROUP_ACTIONS"
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import GifBoxIcon from '@mui/icons-material/GifBox';
import EmptyFileImage from "../../images/empthyFilepng.png"
import { v4 as uuidv4 } from 'uuid';
import ClearIcon from '@mui/icons-material/Clear';
import { groupSocket } from '../../reducer/middlewares/socketMiddleware';
import Diversity3Icon from '@mui/icons-material/Diversity3';


import SendIcon from '@mui/icons-material/Send';
import AddReactionIcon from '@mui/icons-material/AddReaction';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import Message from "../Message"
import { useTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const GroupChat = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const classes = useStyles()
    const dispatch = useDispatch()
    const { id } = useParams()
    const { page } = useParams()
    const user = useSelector(data => data.user.info)
    const chatMessages = useSelector(data => data.group.messages)
    const groupData = useSelector(data => data.group.info)
    const isTypingArray = useSelector(data => data.group.typing)
    const [lastMessageDate, setLastMessageDate] = useState('');
    const scrollRef = useRef(null)
    const chatRef = useRef(null)
    const [isTyping, setIsTyping] = useState(false)
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(true)
    const [currentMessage, setCurrentMessage] = useState({
        content: '',
        image: '',
        file: '',
        files: []
    })
    const hiddenFileInput = useRef(null)
    const [showEmojis, setShowEmojis] = useState(false)
    const nav = useNavigate()
    //initial load
    useEffect(() => {
        if (user?.id && id) {
            dispatch(connectGroupSocket(id, user?.id));
        }
    }, [user?.id, id])
    //first scroll
    useEffect(() => {
        setIsScrolledToBottom(true);
    }, [id]);
    //clear input when changing id
    useEffect(() => {
        setCurrentMessage({
            content: '',
            image: '',
            file: '',
            files: []
        })
        setShowEmojis(false);
    }, [id]);
    //on message receive if user scrolled it wont scroll them to bottom
    useEffect(() => {

        if (isScrolledToBottom && chatRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'instant' });
        }

    }, [id, chatMessages])

    useEffect(() => {
        if (chatRef.current) {
            chatRef?.current?.addEventListener('scroll', handleScroll);
            return () => chatRef?.current?.removeEventListener('scroll', handleScroll);
        }
    }, []);
    const handleScroll = () => {
        if (chatRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
            setIsScrolledToBottom(scrollTop + clientHeight >= scrollHeight - 100);
        }
    };
    //show other if you typing 
    useEffect(() => {
        if (isTyping && groupSocket && groupSocket.readyState === WebSocket.OPEN) {
            groupSocket.send(JSON.stringify({
                type: 'Typing',
                groupId: id,
                userId: user.id,
                name: user.username
            }));
            return
        }
        else if (!isTyping && groupSocket && groupSocket.readyState === WebSocket.OPEN) {
            groupSocket.send(JSON.stringify({
                type: 'stopTyping',
                groupId: id,
                userId: user.id,
                name: user.username
            }));
        }
    }, [isTyping])

    //update input text
    const handleMessageInput = (text) => {
        if (text === '') {
            setIsTyping(false)
        } else {
            setIsTyping(true)
        }
        setCurrentMessage({ ...currentMessage, content: text })
    }
    //Remove selected File 
    const unselectFile = (id) => {
        setCurrentMessage({ ...currentMessage, files: currentMessage.files.filter((f) => f.id !== id) })
    }
    //select the files you want to send
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const maxSizeInBytes = 20 * 1024 * 1024; // 20MB
        if (file && file.size < maxSizeInBytes) {
            const newFile = {
                file: file,
                id: uuidv4(),
                image_url: '',
                name: file.name
            }
            if (file.type.startsWith('image/')) {
                newFile.image_url = URL.createObjectURL(file)
            }
            setCurrentMessage({ ...currentMessage, files: [...currentMessage.files, newFile] });
        }
        event.target.value = ''
    };

    //Handle Send Message
    const sendMessage = async () => {
        console.log(currentMessage.content)
        if (!currentMessage.content && currentMessage.files.length === 0) return;
        const formData = new FormData();
        const token = sessionStorage.getItem('accessToken')
        let files;
        if (currentMessage.files.length > 0) {
            currentMessage.files.forEach((f) => {
                const fileType = f.file.type.startsWith('image/') ? 'image' : 'file';
                formData.append('files', f.file);
                formData.append('fileTypes', fileType)
            });

            const response = await fetch('http://localhost:3001/group/groupMessageUpload', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                method: "POST",
                body: formData
            });

            // Handle the response
            if (response.ok) {
                files = await response.json()
                console.log(files)
            } else {
                console.error('Failed to upload files');
                return
            }
        }
        await fetch('http://localhost:3001/group/sendMessage', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            method: "POST",
            body: JSON.stringify({
                sender_id: user.id,
                sender_image_url: user.image_url,
                sender_username: user.username,
                group_id: id,
                content: currentMessage.content,
                files: files,
                type: 'message'
            })

        })
        setCurrentMessage({
            content: '',
            image: '',
            file: '',
            files: []
        })
        setIsTyping(false)
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage()
            e.preventDefault()
        }

    }

    const hideChat = () => {
        if (page) {
            if (isSmallScreen) {
                return false
            }
        }
        return true
    }
    return (hideChat() &&
        <Card className={classes.fieldContainer} onClick={() => setShowEmojis(false)}>

            {/* HEADER */}
            <div className={classes.header}>
                <ArrowBackIosIcon

                    onClick={() => nav('/groups')} className={classes.headerBackArrow} />

                <span className={classes.headerTitle}>{groupData?.name}</span>
                <Diversity3Icon
                    onClick={() => { nav(`/groups/${id}/members`) }}
                    className={classes.headerBackArrow} />

            </div>


            {/* CHAT FIELD */}
            <Card className={classes.chatField}>
                {/*messages*/}
                <CardContent ref={chatRef} className={classes.chatBox}>

                    {chatMessages.map((msg, index) => {
                        return <Message
                            key={index}
                            msg={msg}
                            lastMessage={index > 0 && chatMessages[index - 1]}
                        />
                    })}
                    {/*empty div for scrolling */}
                    <div ref={scrollRef}></div>
                    {/*isTypingList*/}
                    {isTypingArray.length > 0 && <div className={classes.typingField}>
                        {isTypingArray.map((person, index) => {
                            return <span style={{ marginLeft: '15px' }} key={index}>{person + ' is typing...'}</span>
                        })}
                    </div>}
                </CardContent>
                {/*emojis*/}
                {showEmojis && <div
                    onClick={(e) => {
                        e.stopPropagation()
                    }}
                    className={classes.emojiDiv}><Picker navPosition={'top'} data={data}
                        onEmojiSelect={(emoji) => {
                            const updatedMessage = currentMessage.content + emoji.native
                            setCurrentMessage({ ...currentMessage, content: updatedMessage })
                            setIsTyping(true)

                        }} /></div>}
                {/*selected files*/}
                {currentMessage.files.length > 0 &&
                    <div className={classes.selectedFiles}>
                        {currentMessage.files.map((file, index) => {
                            return <Card key={index} className={classes.fileBox}>
                                <ClearIcon onClick={() => { unselectFile(file.id) }} sx={{ marginLeft: 'auto', cursor: 'pointer' }} />

                                <CardMedia className={classes.fileImage}

                                    component="img"
                                    image={file.image_url ? file.image_url : EmptyFileImage}

                                />
                                <h4 style={{ margin: '0px', fontSize: '10px' }}>{file.name}</h4>

                            </Card>

                        })}
                    </div>}
            </Card>
            <Paper
                onSubmit={(e) => e.preventDefault()}
                className={classes.chatInputField}
                component="form"
            >
                <InputBase

                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Send message..."
                    value={currentMessage?.content}
                    onChange={(e) => { handleMessageInput(e.target.value) }}
                    onKeyDown={handleKeyPress}
                />
                <IconButton
                    onClick={() => hiddenFileInput.current.click()}
                    type="button" sx={{ p: '10px' }} aria-label="search">
                    <FileUploadIcon sx={{ fontSize: '30px', color: 'black' }}
                    />
                    <input
                        type="file"
                        ref={hiddenFileInput}
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                    />
                </IconButton>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton
                    onClick={(event) => {
                        event.stopPropagation()
                        setShowEmojis(!showEmojis)
                    }}
                    color="primary" sx={{ p: '10px', color: 'black' }} aria-label="directions">
                    <AddReactionIcon />
                </IconButton>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton color="primary" sx={{ p: '10px', color: 'black' }} aria-label="directions">
                    <GifBoxIcon />
                </IconButton>
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton onClick={sendMessage} color="primary" sx={{ p: '10px', color: 'black' }} aria-label="directions">
                    <SendIcon />
                </IconButton>

            </Paper>
        </Card>
    )
}

export default GroupChat