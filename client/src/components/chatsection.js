import React, { useState, useEffect, useContext, useRef } from 'react';
import { Avatar, Box, Button, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { BiCheckDouble } from "react-icons/bi";
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import { io } from 'socket.io-client';

const Chatsection = ({ selectedConversations, newConvo }) => {
    const { userId: selfUserId } = useContext(UserContext);
    const [chats, setChats] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [msg, setMsg] = useState("");
    const socket = useRef();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        socket.current.emit("addUser", selfUserId);

        socket.current.on("getMessage", data => {
            setChats(prev => [...prev, {
                senderId: data.senderId,
                message: data.text,
                createdAt: Date.now(),
            }]);
            scrollToBottom();
        });

        return () => {
            socket.current.disconnect();
        };
    }, [selfUserId]);

    useEffect(() => {
        if (!newConvo && selectedConversations) {
            fetchMessages();
            const friendId = selectedConversations.members.find((m) => m !== selfUserId);
            getUser(friendId);
        } else if (newConvo) {
            setChats([]);
            setSelectedUser(selectedConversations);
        }
        scrollToBottom();
    }, [selectedConversations, newConvo, selfUserId]);
    
    const [isNewConvo, setIsNewConvo] = useState(newConvo);
    const [conversationId , setconversationId]= useState(isNewConvo ? null : selectedConversations._id);
const megSender = async () => {
    if (!msg.trim()) return;

    try {
        let conversationIdToUse = conversationId; // default to current conversation ID
        const receiverId = newConvo ? selectedConversations._id : selectedConversations.members.find(userId => selfUserId !== userId);

        // Create a new conversation if needed
        if (newConvo && isNewConvo) {
            const newConversation = await axios.post(`${process.env.REACT_APP_API_URL}/api/conversation/createConversation`, {
                members: [selfUserId, selectedConversations._id]
            });
            console.log("new convo",newConversation.data.data);
            conversationIdToUse = newConversation.data.data._id; // update with the new conversation ID
            setconversationId(conversationIdToUse); // set the conversation ID state
            setIsNewConvo(false); // mark the conversation as established
        }

        // Send the message to the socket and backend
        socket.current.emit("sendMessage", {
            senderId: selfUserId,
            receiverId: receiverId,
            text: msg
        });

        const newMessage = {
            conversationId: conversationIdToUse, // use the updated or existing conversation ID
            senderId: selfUserId,
            message: msg,
            createdAt: Date.now()
        };
        await axios.post(`${process.env.REACT_APP_API_URL}/api/message/createMessage`, newMessage);

        setChats(prev => [...prev, newMessage]); // Add the new message to the chat
        setMsg(""); // Clear the input field
        scrollToBottom(); // Scroll to the latest message

    } catch (err) {
        console.log(err);
    }
};


    const getTime = (createdAt) => {
        const dateObj = new Date(createdAt);
        let hours = dateObj.getHours();
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${ampm}`;
    };
    
    const fetchMessages = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/message/getAllMessages/${selectedConversations._id}`);
            const sortedMessages = res.data.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            setChats(sortedMessages);
            scrollToBottom();
        } catch (err) {
            console.log(err);
        } 
    };

    const getUser = async (friendId) => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/getUser/${friendId}`);
            setSelectedUser(res.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Box p={4} borderBottom="1px solid" borderColor="gray.600">
                <HStack _hover={{ cursor: "pointer" }} onClick={() => window.location.href = `/profile/${selectedUser?._id}`}>
                    <Avatar src={selectedUser?.profilePicture} alt={selectedUser?.username} mr={2} size="md" />
                    <Text color="white" fontSize="xl" fontWeight="bold">{selectedUser?.name}</Text>
                </HStack>
            </Box>

            <VStack flex={1} overflowY="auto" p={4} spacing={4} alignItems="stretch">
                {chats.map((chat, index) => (
                    <HStack key={index} alignSelf={chat.senderId !== selfUserId ? 'flex-start' : 'flex-end'} maxW="70%">
                        {chat.senderId !== selfUserId && (
                            <Avatar src={selectedUser?.profilePicture} alt={selectedUser?.username} size="sm" />
                        )}
                        <HStack alignItems="flex-end" spacing={2}>
                            <VStack align={'end'} spacing={1}>
                                <Text color="white" p={2} fontSize="md" rounded="md" bg={chat.senderId === selfUserId ? 'blue.600' : 'gray.600'}>
                                    {chat.message}
                                </Text>
                                <HStack spacing={1}>
                                    <Text fontSize="xs" color="gray.400">{getTime(chat.createdAt)}</Text>
                                    {chat.senderId === selfUserId && (
                                        <BiCheckDouble color={chat.seen ? 'skyblue' : 'gray'} size={16} />
                                    )}
                                </HStack>
                            </VStack>
                        </HStack>
                    </HStack>
                ))}
                <div ref={messagesEndRef} />
            </VStack>

            <Box p={4} borderTop="1px solid" borderColor="gray.600">
                <HStack>
                    <Input 
                        placeholder="Have something to share..." 
                        rounded="15px" 
                        value={msg} 
                        onKeyPress={(e) => e.key === 'Enter' && megSender()} 
                        onChange={(e) => setMsg(e.target.value)} 
                    />
                    <Button colorScheme="blue" onClick={megSender}>
                        Post
                    </Button>
                </HStack>
            </Box>
        </>
    );
};

export default Chatsection;