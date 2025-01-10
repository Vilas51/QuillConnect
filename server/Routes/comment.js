const express = require('express')
const router = express.Router();

const {createComment, likeUnlikeComment, getAllComment, deleteComment} = require('../controllers/commentController');

router.post('/:id', createComment);
router.get('/getAllComments/:id', getAllComment)
router.put('/likeUnlikeComment/:id', likeUnlikeComment);
router.delete('/deleteComment/:id', deleteComment);

module.exports = router;