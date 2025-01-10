import React, { useState, useEffect, useContext } from 'react';
import { Box, Image, Text, Avatar, Flex, Icon, HStack, MenuItem, MenuList, Menu, MenuButton, IconButton } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { AiOutlineHeart, AiFillHeart, AiOutlineMessage, AiOutlineMore } from 'react-icons/ai';
import axios from 'axios';
import { format } from 'timeago.js';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import CommentSection from '../components/comment';

const bounce = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
`;

const isImage = (mediaUrl) => {
  const cleanUrl = mediaUrl.split('?')[0];
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const extension = cleanUrl.split('.').pop().toLowerCase();
  return imageExtensions.includes(extension);
};

const SocialMediaPost = ({ post }) => {
  const selfUserId = useContext(UserContext).userId;
  const [selfUser, setSelfUser] = useState({});
  const [user, setUser] = useState({});
  const [liked, setLiked] = useState(post.likes.includes(selfUserId));
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [showComments, setShowComments] = useState(false);

  const toggleComments = () => {
    setShowComments(!showComments);
  };
  
  const handleLikeClick = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/posts/likeUnlikePost/${post._id}`, {userId: selfUserId}, {new: true});
      setLiked(!liked);
      setLikeCount(!liked ? likeCount + 1 : likeCount - 1);
    } catch(error) {
      console.log("Error while liking/unliking", error);
    }
  };

  const handleAddBookmark = async () => {
    // Implement bookmark functionality
    try{
      const newPost = await axios.post(`${process.env.REACT_APP_API_URL}/api/posts/addBookmark/${post._id}`, {userId : selfUserId})
      console.log(newPost)
    }catch(err){
      console.log(err)
    }   
    console.log("Bookmark clicked");
  };
  const handleDeleteBookmark = async () => {
    // Implement bookmark functionality
    try{
      const newPost = await axios.post(`${process.env.REACT_APP_API_URL}/api/posts/deleteBookmark/${post._id}`, {userId : selfUserId})
      console.log(newPost)
    }catch(err){
      console.log(err)
    }   
    console.log("Bookmark deleted");
  };

  const handleDelete = async () => {
    // Implement delete functionality
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/posts/deletePost/${post._id}`, {
        data: { userId: selfUserId }
      });
      console.log(response);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
    console.log("Delete clicked");
  };

  useEffect(()=>{
    const fetchSelfUser = async () => {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/getUser/${selfUserId}`);
      setSelfUser(res.data.data);
    };
    fetchSelfUser();
  }, [selfUserId]);


  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/getUser/${post.userId}`);
      setUser(res.data.data);
    };
    fetchUsers();
  }, [post.userId]);

  return (
    <Box
      width={600}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="sm"
      p="4"
    >
      <HStack justify="space-between">
        <Flex align="center">
          <Link to={selfUserId === user._id ? `/profile` : `/profile/${user._id}`}>
            <Avatar
              src={user.profilePicture || "https://t4.ftcdn.net/jpg/00/65/77/27/360_F_65772719_A1UV5kLi5nCEWI0BNLLiFaBPEkUbv5Fv.jpg"}
              alt="Profile"
              size="md"
            />
          </Link>
          <Box ml="3">
            <Text fontWeight="bold">{user.name}</Text>
            <Text fontSize="sm" color="gray.500">
              {format(post.createdAt)}
            </Text>
          </Box>
        </Flex>

        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<AiOutlineMore />}
            variant="ghost"
          />
          <MenuList minWidth="120px">
            { selfUser?.bookmarks?.includes(post._id) ? <MenuItem onClick={handleDeleteBookmark}>
            Remove Bookmark
            </MenuItem> :
            <MenuItem onClick={handleAddBookmark}>
              Bookmark
            </MenuItem>}
           { post.userId === selfUserId && <MenuItem 
              onClick={handleDelete}
              _hover={{ bg: "red.100" }}
              color="red.600"
              fontWeight={'bold'}
            >
              Delete
            </MenuItem>}
          </MenuList>
        </Menu>
      </HStack>

      {post?.media && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          maxW="100%"
          overflow="hidden"
          mt="4"
        >
          {isImage(post.media) ? (
            <Image
              src={post.media}
              borderRadius="md"
              mb="4"
              objectFit="cover"
              width="100%"
              maxH="400px"
              height="auto"
            />
          ) : (
            <video
              src={post.media}
              controls
              style={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'cover',
                borderRadius: 'md',
              }}
            />
          )}
        </Box>
      )}

      <Text fontSize="lg" mb="4">
        {post?.caption}
      </Text>

      <Flex justify="space-between" align="center">
        <Flex align="center">
          <Icon
            as={liked ? AiFillHeart : AiOutlineHeart}
            boxSize={6}
            color={liked ? 'red.500' : 'red.400'}
            cursor="pointer"
            onClick={handleLikeClick}
            animation={`${liked ? bounce : ''} 0.3s`}
          />
          <Text ml="1" fontSize="sm">
            {likeCount} people like it
          </Text>
        </Flex>

        <Flex align="center" cursor="pointer" onClick={toggleComments}>
          <Icon as={AiOutlineMessage} boxSize={5} />
          <Text ml="1" fontSize="sm">
            {post.comments?.length || 0} comments
          </Text>
        </Flex>
      </Flex>

      {showComments && <CommentSection postId={post._id} />}
    </Box>
  );
};

export default SocialMediaPost;