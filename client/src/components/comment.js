import React, { useState, useEffect, useContext } from 'react';
import { Box, VStack, HStack, Text, Avatar, Input, Button, Divider, IconButton } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import { format } from 'timeago.js';

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const selfUserId = useContext(UserContext).userId;
  const [currentUser, setCurrentUser] = useState(null);

  const fetchComments = async () => {
      try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/comment/getAllComments/${postId}`);
          setComments(response.data.data );
          // console.log("comments", response.data.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };
    
    const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/comment/${postId}`, {
          userId: currentUser._id,
          name: currentUser.name,
        comment: newComment,
        profilePicture: currentUser.profilePicture,
      });
      setComments([...comments, response.data.data.comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
};

const handleDeleteComment = async (commentId) => {
    try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/comment/deleteComment/${commentId}`);
        setComments(comments.filter(comment => comment._id !== commentId));
    } catch (error) {
        console.error('Error deleting comment:', error);
    }
};

useEffect(() => {
  if (selfUserId) {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/getUser/${selfUserId}`);
        setCurrentUser(response.data.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }
  fetchComments();
}, [postId, handleSubmitComment]);
return (
  selfUserId && (
    <Box mt={4}>
      <Divider mb={4} />
      <HStack mt={4} mb={4} >
        <Input
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button onClick={handleSubmitComment} colorScheme="blue">
          Post
        </Button>
      </HStack>
      <VStack spacing={4} align="stretch">
        {comments.length > 0 && comments.map((comment) => (
          <HStack key={comment._id} spacing={3} align="start" justifyContent="space-between">
            <HStack spacing={3} align="start">
              <Avatar 
                size="sm" 
                onClick={() => { window.location.href = `/profile/${comment.userId}`; }} 
                src={comment?.profilePicture} 
                cursor="pointer"
              />
              <Box>
                <HStack>
                  <Text fontWeight="bold">{comment?.name}</Text>
                  <Text fontSize="xs" color="gray.500">
                    {format(comment?.createdAt)}
                  </Text>
                </HStack>
                <Text fontSize="sm">{comment?.comment}</Text>
              </Box>
            </HStack>
            {currentUser && currentUser._id === comment.userId && (
              <IconButton
                aria-label="Delete comment"
                icon={<DeleteIcon />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={() => handleDeleteComment(comment._id)}
              />
            )}
          </HStack>
        ))}
      </VStack>
      
    </Box>
  ) 
  );
};

export default CommentSection;