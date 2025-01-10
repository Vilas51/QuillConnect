import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { Box, Flex, Image, Avatar, Text } from '@chakra-ui/react';
import SideBar from '../components/SideBar';
import Feed from '../components/Feed';
import RightBar from '../components/RightBar';
import { useParams } from 'react-router-dom'; // Uncommented
import { UserContext } from '../context/UserContext';
import axios from 'axios';

const Profile = () => {
  const { id } = useParams(); // Extract id from URL
  const selfUserId = useContext(UserContext).userId;
  const [defaultUser, setDefaultUser] = useState(null);
  const [user, setUser] = useState(defaultUser); // State to hold user data

  useEffect(() => {
    if (!id && selfUserId) {
      const fetchdefaultUser = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/getUser/${selfUserId}`);
          setDefaultUser(response.data.data);
          setUser(response.data.data);
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      };
      fetchdefaultUser();
    }
  }, [selfUserId]);

  useEffect(() => {
    const fetchUser = async () => {
      if (id) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/getUser/${id}`);
          setUser(response.data.data); // Set user data from API response
          console.log('============>',response)
        } catch (err) {
          console.log("Error fetching user data:", err);
          // window.location.href = '/nopage'; // Redirect if error occurs
        } 
      }
    };

    fetchUser(); // Call the function to fetch user data if `id` exists
  }, [id]);



  return (
    user &&
    <Box>
      <Navbar />
      <Flex>
        <SideBar />
        <Box flex={1} flexDirection="column">
          {/* Banner Image */}
          <Box position="relative" height={400}>
            <Image
              src={user.coverPicture}
              width={'100%'}
              objectFit="cover"
              height={305}
            />
            {/* Avatar and Bio - Centered */}
            <Flex 
              position="absolute"
              bottom={-21}
              width="100%" 
              justifyContent="center" 
              alignItems="center"
              flexDirection="column"
            >
              <Avatar
                size="2xl"
                name={user.name}
                src={user.profilePicture}
              />
              
              <Text fontSize="2xl" fontWeight="bold">
                {user.name}
              </Text>
              <Text fontSize="md">{user.bio}</Text>
            </Flex>
          </Box>

          {/* Main Content (Feed + RightBar) */}
          <Flex mt={6} px={6}>
            <Feed userId={user._id} />
            <RightBar user={user} />
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default Profile;
