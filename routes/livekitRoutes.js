const express = require('express');
const router = express.Router();
const {generateMeetingToken} = require('../controllers/tokenController');
router.post('/token',generateMeetingToken);
module.exports = router;