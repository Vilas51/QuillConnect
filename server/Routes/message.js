const express = require('express');
const router = express.Router();

const {createMessage, getAllMessages, getLastMessage, deleteMessage} = require('../controllers/messageController');

router.post('/createMessage', createMessage);
router.get('/getAllMessages/:conversationId', getAllMessages);
router.get('/lastMessage/:conversationId', getLastMessage);
router.delete('/deleteMessage/:messageId', deleteMessage);

module.exports = router; 