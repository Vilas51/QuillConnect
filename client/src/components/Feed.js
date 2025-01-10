import React, { useEffect, useState } from 'react';
import Share from './Share';
import { Box, Spinner } from '@chakra-ui/react';
import Post from './Post';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { useContext } from 'react';

const Feed = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  const selfUserId = useContext(UserContext).userId;
  const [user, setUser] = useState(null);


  useEffect(() => {
    if (selfUserId) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/getUser/${selfUserId}`);
          setUser(response.data.data);
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      };
      fetchUser();
    }

  }, [selfUserId]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = userId
        ? await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/getAllUserPost/${userId}`)
        : await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/getAllPost/${selfUserId}`);
     console.log(res.data.data);
      setPosts(res.data.data);
    };
    user && fetchPosts();
  }, [userId, selfUserId, user]);
 

  return (
    <Box width={800} display="flex" alignItems="center" flexDirection="column" gap={2}>
      <Share />

      {posts === undefined || posts.length === 0 ? (
        <>
          <Box>No posts yet!</Box>
          <Box>Follow others to see the posts</Box>
        </>
       
      ) : (
        posts.map((post) => <Post key={post._id} post={post} />)
      )}
    </Box>
  );
};

export default Feed;
