import React, { useContext, useEffect, useState } from 'react'
import { Box, Text, Flex, Avatar } from '@chakra-ui/react'
import axios from 'axios'
import { UserContext } from '../context/UserContext'

const OnlineFriendComponent = ({ userId }) => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const selfuserId = useContext(UserContext).userId;

  useEffect(() => {
    console.log("onlineFFFF", userId)
    const fetchUser = async () => {
      setIsLoading(true)
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/getUser/${userId}`)
        setUser(res.data.data)
        setError(null)
      } catch (err) {
        console.error('Error fetching user:', err)
        setError('Failed to fetch user data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  if (isLoading) {
    return <Box>Loading...</Box>
  }

  if (error) {
    return <Box color="red.500">{error}</Box>
  }

  if (!user) {
    return null
  }

  return (
    <Flex align="center" mb="3" onClick={()=>selfuserId === userId ? window.location.href = `/profile` : window.location.href = `/profile/${userId}`} _hover={{cursor : "pointer"}}>
      <Box position="relative">
        <Avatar
          boxSize="40px"
          borderRadius="full"
          src={user.profilePicture}
          alt={user.username}
        />
        <Box
          position="absolute"
          top="-1px"
          right="-1px"
          boxSize="12px"
          borderRadius="50%"
          bg="green.400"
          border="2px solid white"
        />
      </Box>
      <Box ml="3">
        <Text fontWeight="bold" fontSize="sm">
          {user.name}
        </Text>
      </Box>
    </Flex>
  )
}

export default OnlineFriendComponent