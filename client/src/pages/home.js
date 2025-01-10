import React from 'react'
import Navbar from '../components/Navbar';
import {Box, Flex} from '@chakra-ui/react';
import SideBar from '../components/SideBar'
import Feed from '../components/Feed';
import RightBar from '../components/RightBar';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { useRef } from 'react';
import { OnlineFriend } from '../context/OnlineFriend';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

const Home = () => {
  const userId = useContext(UserContext).userId;
  const {onlinefriends, setOnlineFriends} = useContext(OnlineFriend);
  const socket = useRef();
  if(!userId) {
    window.location.href = "/login";
  }

  useEffect(()=>{
    socket.current = io("ws://localhost:8900");
  },[])

  useEffect(()=>{
    socket?.current.emit("addUser", userId)   
    socket?.current.on("getUsers", users => {
      setOnlineFriends(users);
      console.log("online online f: ", onlinefriends); 
    })
  },[userId])
  console.log(userId);
  return (
    <Box>
      <Navbar/>
        <Flex  >
        <SideBar  />
        <Feed />
        <RightBar/>
      </Flex>
    </Box>
  )
}

export default Home