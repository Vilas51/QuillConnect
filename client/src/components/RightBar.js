import React, { useEffect, useState } from 'react';
import { Box, Text, Flex, Image, Icon, Divider, Stack, SimpleGrid, HStack, Button } from '@chakra-ui/react';
import {EditIcon, ChatIcon} from '@chakra-ui/icons'
import { FaGift } from 'react-icons/fa';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import {UserContext} from '../context/UserContext';
import FollowerFriend from './FollowerFriend';
import { OnlineFriend } from '../context/OnlineFriend';
import OnlineFriendComponent from '../components/OnlineFriendComponent'

const RightSidebar = ( {user} ) => {
  const {id} = useParams();
  const [isFollowed, setIsFollowed] = useState(null);
  const [followers, setFollowers] = useState([]);
  const selfUserId = useContext(UserContext).userId;
  const [selfUser, setUser] = useState(null);

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
  }, []);

  const fetchfollowers = async()=>{
    if(user){
      try{
        console.log("xxxxxxxx",user)
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/getUser/${user._id}`);
        console.log("followers", res?.data.data.followers) 
        setFollowers(res?.data.data.followers)
      }catch(error){ 
        console.error(error)
      }      
    }

  }

  const followHandler = async() => {
    try{
        console.log("followuser")
        await axios.put(`${process.env.REACT_APP_API_URL}/api/user/followUser/${id}`, {userId : selfUserId});
        setIsFollowed(!isFollowed);
        console.log("followed successfully")
    }catch(err){
      console.log("error while following => ", err)
    }
  }

  const unfollowHandler = async() => {
    try{
        await axios.put(`${process.env.REACT_APP_API_URL}/api/user/unfollowUser/${id}`, {userId : selfUserId});
        setIsFollowed(!isFollowed);
        console.log("unfollowed successfully")
    }catch(err){
      console.log("error while unfollowing => ", err)
    }
  }

  const handleMessageClick = () => {
    window.location.href = '/messenger'
  }

  useEffect(()=>{
    const fetchUser = async() => {
      console.log("id",id)
      if(id){
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/getUser/${id}`);
          const nextUser = response.data.data;

          if(selfUser?.followings.includes(nextUser._id)){
            setIsFollowed(true);
          }else{ 
            setIsFollowed(false);
          }

          
        } catch (err) {
          console.log("Error fetching user data:", err);
          // window.location.href = '/nopage'; // Redirect if error occurs
        } 
      }
    }
    fetchUser();
    
  },[selfUser]);

  useEffect(()=>{
    fetchfollowers();
  },[user])
  
  const HomePageComponent = () => {
    const {onlinefriends} = useContext(OnlineFriend);
    return (
      <>
        {/* Birthdays Section */}
        <Flex align="center" mb="4">
          <Icon as={FaGift} color="red.400" boxSize="5" />
          <Text ml="2" fontSize="lg" fontWeight="bold">
            Pola Foster and 3 other friends have a birthday today.
          </Text>
        </Flex>

        {/* Ad Section */}
        <Box mb="6">
          <Image
            src="https://adlersden.com/wp-content/uploads/2021/07/Rakhi-Toon-Gift-Box-For-Kids.jpg"
            alt="Advertisement"
            borderRadius="md"
          />
        </Box>

        {/* Divider */}
        <Divider />

        {/* Online Friends Section */}
        <Box mt="6">
          <Text fontSize="md" fontWeight="bold" mb="4">
            Online Friends
          </Text>

          {
            onlinefriends?.map((onlineFriend)=>{
              return <OnlineFriendComponent userId = {onlineFriend} />
            })
          }
          
        </Box>
      </>
    );
  };

  const profilePageComponent = () => {
    return (
      <>
        <Stack borderBottom={'white 1px solid'} pb={3}> 
          <HStack>
            <Text fontSize={'2xl'}>User Information: </Text>   
            {!id ? <EditIcon _hover={{cursor : "pointer"}} onClick={()=>{window.location.href = '/editDetails'}}/> :
                      (isFollowed ? 
                      <Button colorScheme='teal' variant='outline' onClick={unfollowHandler} >Unfollow</Button> : 
                        <Button colorScheme='teal' variant='outline' onClick={followHandler} >Follow</Button>)
            }          
             { ( id &&
                <Button
                  colorScheme="blue"
                  variant="solid"
                  onClick={handleMessageClick}
                >
                  <ChatIcon />
                </Button>
                
              )}   
          </HStack>
          <Box>
            <Text> Location : {user.location}  </Text>
            <Text> Followers : {user.followers ? user.followers.length : 0} </Text>
            <Text> Followings : {user.followings ? user.followings.length : 0}</Text>
          </Box>
        </Stack>

        <Stack mt={3}>
          <Text fontSize={'2xl'}>User Friends: </Text>

          {/* Grid for Rectangular Images */}
          <SimpleGrid columns={3} spacing={5}>
            {/* Repeat Image block for each friend */}

            {
              followers.map((followerId, index) => (
                <FollowerFriend key={index} id={followerId} />
              )) 
            }

          </SimpleGrid>
        </Stack>
      </>
    );
  };

  return (
    <Box
      width="450px"
      p="4"
      borderLeft="1px"
      borderColor="gray.200"
      top="16"
      height="100vh"
    >
      {user ? profilePageComponent() : HomePageComponent()}  
    </Box>
  );
};

export default RightSidebar;
