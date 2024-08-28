const express = require('express');
const {getUsersBySearchTerm,getUserData} = require('../controllers/users')
const router = express.Router();

router.post('/searchTerm', getUsersBySearchTerm);
router.post('/getData',getUserData)


module.exports = router;