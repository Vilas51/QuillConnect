import React, { useContext ,useState, useEffect} from 'react'
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import { Avatar, Box, Text, VStack } from '@chakra-ui/react';

const Conversation = ({conversation, onClick}) => {

    const selfuserId = useContext(UserContext).userId;
        
    const [friend,setFriend] = useState(null);
    const [lastChat,setLastChat] = useState("");
    useEffect(()=>{
        const friendId = conversation.members.find((m) => m !== selfuserId);
        const getUser = async () => {
            try{
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/getUser/${friendId}`)
                console.log("resssssssssssss",res.data.data)
                setFriend(res.data.data)
            }catch(error){
                console.error(error)
            }
        }

        const getLastChat = async () => {
            try{
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/message/lastMessage/${conversation._id}`)
                console.log("redatamessage", res.data.data[0].message)
                setLastChat(res.data.data[0].message)
            }catch(error){

                console.error(error)
            }
        }
        getUser();
        getLastChat();
    },[conversation])

  return (
    <Box
              color="white"
              fontFamily="cursive"
              display="flex"
              borderBottom="1px solid"
              borderColor="gray.600"
              p={2}
              cursor="pointer"
              _hover={{ bg: "gray.700" }}
              onClick={onClick}
            >
              <Avatar src={friend != null && friend.profilePicture} alt={friend != null && friend.username} mr={2} size="md" />
              <VStack alignItems="start" spacing={0}>
                <Text fontWeight="bold" fontSize="lg">
                  {friend != null && friend.name}
                </Text>
                <Text fontSize="sm" color="gray.300">{lastChat}</Text>
              </VStack>
            </Box>
  )
}

export default Conversation