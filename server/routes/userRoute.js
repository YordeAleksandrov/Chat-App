const express = require('express');
const { getUsersBySearchTerm,
        getUserData,
        getUsersBySearchTerm_Friends } = require('../controllers/users')
const router = express.Router();

router.post('/searchTerm', getUsersBySearchTerm);
router.post('/getData', getUserData)
router.post('/searchTermFriends', getUsersBySearchTerm_Friends)


module.exports = router;