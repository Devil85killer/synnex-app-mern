const express = require('express');
const router = express.Router();

// Apne controller se functions import kar rahe hain
const { saveMeetingLink, getMeetingLink, getAllMeetings } = require('../controllers/meetingController');

// 1. Nayi meeting save karne ke liye (POST request)
router.post('/', saveMeetingLink);

// 2. Latest meeting dekhne ke liye (GET request - Students ke popup ke liye)
router.get('/', getMeetingLink);

// 3. Saari meetings ki history dekhne ke liye (GET request - Admin panel ke liye)
router.get('/all', getAllMeetings);

module.exports = router;
