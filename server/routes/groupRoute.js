const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const authenticateToken = require('../middwares/authentication');
const { uploadImage,
    loadPublicGroups,
    handleSendMessage,
    joinGroup, createGroup,
    getGroupsByUserId,
    dataBy_UserId_Group_Id,
    addReaction,
    deleteGroupInvitation,
    uploadMessageFiles } = require('../controllers/groups');

const route = express.Router();

// Middleware setup
route.use(bodyParser.json());
route.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

const groupStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/groupMessageUploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const groupUpload = multer({ storage: groupStorage });


route.post('/create', authenticateToken, createGroup);
route.get('/:userId', authenticateToken, getGroupsByUserId);
route.post('/upload', authenticateToken, upload.single('file'), uploadImage);
route.post('/groupMessageUpload', authenticateToken, groupUpload.array('files'), uploadMessageFiles);
route.get('/data/:groupId/:userId', authenticateToken, dataBy_UserId_Group_Id);
route.post('/sendMessage', authenticateToken, handleSendMessage)
route.post('/join', authenticateToken, joinGroup)
route.post('/publicGroups', loadPublicGroups)
route.post('/declineInvitation',deleteGroupInvitation)


module.exports = route; 