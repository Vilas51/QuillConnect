import React, { useState, useEffect, useContext, useRef } from 'react';
import { Avatar, Box, HStack, Input, Text, List, ListItem, Icon, Flex, useColorModeValue } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { FaHome } from "react-icons/fa";
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import Conversation from '../components/conversation';
import ChatSection from '../components/chatsection';
import { OnlineFriend } from '../context/OnlineFriend';
import { io } from 'socket.io-client';
import { motion } from "framer-motion";

const AnimatedText = motion(Text);

const Messenger = () => {
  const userId = useContext(UserContext).userId;
  const [users, setUsers] = useState([])
  const [newConvo, setIsNewConvo] = useState(false)
  const [conversations, setConversations] = useState([]);
  const [selectedConversations, setSelectedConversations] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const {onlinefriends, setOnlineFriends} = useContext(OnlineFriend);
  const socket = useRef();

  const bgColor = useColorModeValue("blue.500", "blue.800");
  const textColor = useColorModeValue("white", "gray.200");

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
  }, [])

  useEffect(() => {
    socket?.current.emit("addUser", userId)   
    socket?.current.on("getUsers", users => {
      setOnlineFriends(users);
      console.log("online online f: ", onlinefriends); 
    })
  }, [userId])

  const fetchAllUsers = async() => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/getAllUsers`)
      setUsers(res.data.data)
    } catch(error) {
      console.error(error)
    }
  }

  const suggestedUserHandler = async(u) => {
    try {
      const id1 = u._id;
      const id2 = userId;
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/conversation/getSingleConversation?id1=${id1}&id2=${id2}`);
      console.log("res",res.data.data[0]);
      if(res.data.data.length === 0) {
        setIsNewConvo(true);
        setSelectedConversations(u);
      } else {
        setIsNewConvo(false);
        setSelectedConversations(res.data.data[0]);
      }
      
      setSearchTerm('');
    } catch(err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const results = users.filter(u => u.username.toLowerCase().includes(searchTerm.toLowerCase()));
    setSearchResults(results);
  }, [searchTerm]);
  
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/conversation/getConversation/${userId}`)
        setConversations(res.data.data) 
      } catch(error) {
        console.error(error) 
      }
    }
    
    fetchConversations();
    fetchAllUsers();
  }, [userId])

  const chatOpener = (conver) => {
    setSelectedConversations(conver);
    setSearchTerm('');
  };

  return (
    <Flex h="100vh">
      {/* Users list section */}
      <Flex w="30%" flexDirection="column" borderRight="1px solid" borderColor="gray.600">
        {/* Fixed header */}
        <Box p={4} borderBottom="1px solid" borderColor="gray.600" bg={bgColor}>
          <HStack spacing={4} onClick={() => window.location.href = '/'} cursor="pointer">
            <Icon as={FaHome} boxSize={6} color={textColor} />
            <Flex alignItems="center">
              <AnimatedText
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                color={textColor}
                fontWeight="extrabold"
                fontSize={{ base: "xl", md: "2xl" }}
                fontStyle="italic"
                textShadow="2px 2px 4px rgba(0,0,0,0.3)"
                letterSpacing="wider"
              >
                Quill
              </AnimatedText>
              <AnimatedText
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                color={useColorModeValue("yellow.300", "yellow.200")}
                fontWeight="extrabold"
                fontSize={{ base: "xl", md: "2xl" }}
                fontStyle="italic"
                textShadow="2px 2px 4px rgba(0,0,0,0.3)"
                letterSpacing="wider"
                ml={1}
              >
                Connect
              </AnimatedText>
              <AnimatedText
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                color={textColor}
                fontWeight="bold"
                fontSize={{ base: "lg", md: "xl" }}
                ml={2}
              >
                Chat
              </AnimatedText>
            </Flex>
          </HStack>
        </Box>

        {/* Search bar */}
        <Box p={4} borderBottom="1px solid" borderColor="gray.600">
          <Box position="relative">
            <Input
              placeholder="Search for a user"
              rounded="15px"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon
              position="absolute"
              right="20px"
              top="50%"
              transform="translateY(-50%)"
              color="gray.500"
            />
          </Box>
        </Box>

        {/* Scrollable user list */}
        <Box overflowY="auto" flex={1}>
          {searchTerm && (
            <List
              bg="white"
              borderRadius="md"
              boxShadow="md"
              mb={2}
            >
              {searchResults.map((user) => (
                <ListItem
                  key={user.id}
                  onClick={() => {
                    suggestedUserHandler(user);
                  }}
                  p={2}
                  _hover={{ bg: "gray.100" }}
                  cursor="pointer"
                >
                  <HStack>
                    <Avatar src={user.profilePicture} size="sm" />
                    <Text color="black">{user.username}</Text>
                  </HStack>
                </ListItem>
              ))}
            </List>
          )}
          {conversations.map((c) => (
            <Conversation key={c._id} conversation={c} onClick={() => chatOpener(c)} />
          ))}
        </Box>
      </Flex>

      {/* Chat section */}
      <Flex w="70%" flexDirection="column">
        {selectedConversations === null ? (
          <Flex flex={1} alignItems="center" justifyContent="center">
            <Text color="white" fontSize="2xl">Select a user to start chatting</Text>
          </Flex>
        ) : (
          <ChatSection selectedConversations={selectedConversations} newConvo={newConvo} />
        )}
      </Flex>
    </Flex>
  );
}

export default Messenger;