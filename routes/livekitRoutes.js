const express = require('express');
const router = express.Router();
const {generateMeetingToken, generateAdminToken, generateRecordingToken} = require('../controllers/tokenController');

router.post('/usertoken',generateMeetingToken);
router.post('/adminToken',generateAdminToken);
router.post('/recordingToken',generateRecordingToken);

module.exports = router;