const express = require('express');
const router = express.Router();

const {createConversation, getSingleConversation,  getConversation, addMember, removeMember, deleteConversation} = require('../controllers/conversationController');

router.post('/createConversation', createConversation);
router.get('/getSingleConversation/', getSingleConversation);
router.get('/getConversation/:userId', getConversation);
router.put('/addMember/:conversationId', addMember);
router.put('/removeMember/:conversationId', removeMember);
router.delete('/deleteConversation/:id', deleteConversation);

module.exports = router;  