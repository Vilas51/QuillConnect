import React, { useContext, useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { FiSearch } from 'react-icons/fi';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import Post from '../components/Post';
import Navbar from '../components/Navbar';


const BookmarkPage = () => {
  const { userId } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [postsId, setPostsId] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchpost = async (bookmark) => {
    const postdata = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/getPost/${bookmark}`);
    return postdata.data.data;
  }
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/getUser/${userId}`);
        setPostsId(response.data.data.bookmarks);
        const posts = await Promise.all(response.data.data.bookmarks.map(fetchpost));
        setPosts(posts);
        console.log(posts);
        setError(null);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load bookmarks. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [userId]);

  const filteredPosts = posts.filter(post =>
    post?.caption.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    <Navbar/>
    <Box maxWidth="1200px" margin="auto" p={4}>
      
      <VStack spacing={6} align="stretch">
        
        <Heading size="xl" mb={2} display={"flex"} alignItems={'center'}>
           Your Bookmarks
        </Heading>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <FiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            type="text"
            placeholder="Search your bookmarks"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        {isLoading ? (
          <Spinner size="xl" alignSelf="center" />
        ) : error ? (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        ) : filteredPosts.length === 0 ? (
          <Text fontSize="lg" textAlign="center">No bookmarks found. Start saving some posts!</Text>
        ) : (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 2 }} spacing={10}>
            {filteredPosts.map((post) => (
              <Post key={post._id} post={post}  size="small" />
            ))}
          </SimpleGrid>
        )}
      </VStack>
    </Box>
            </>
  );
};

export default BookmarkPage;