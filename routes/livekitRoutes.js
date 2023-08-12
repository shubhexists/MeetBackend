const express = require('express');
const router = express.Router();
const {generateMeetingToken, generateAdminToken} = require('../controllers/tokenController');
router.post('/usertoken',generateMeetingToken);
router.post('/adminToken',generateAdminToken);
module.exports = router;