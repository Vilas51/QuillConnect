import React, { useState } from 'react';
import { Box, Button, Input, VStack, Text, FormControl, useToast, Image, Flex } from '@chakra-ui/react';
import axios from 'axios';

const RegisterPage = () => {
  const toast = useToast();
  const [user, setUser] = useState({ name: "", username: "", email: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (user.password !== confirmPassword || confirmPassword === "") {
      toast({
        title: 'Password Mismatch',
        description: "Ensure to enter the same password.",
        status: 'error',
        duration: 7000,
        isClosable: false,
      });
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, user);
      console.log(response);

      toast({
        title: 'Account created.',
        description: "We've created your account for you.",
        status: 'success',
        duration: 7000,
        isClosable: true,
      });

      window.location.href = '/login';

    } catch (error) {
      toast({
        title: 'Error creating account',
        description: error.response?.data?.message || "An error occurred while creating your account.",
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex 
      direction={{ base: "column", md: "row" }} 
      align="center" 
      justify="center" 
      minH="100vh" 
      bg="gray.900" 
      p={{ base: 4, md: 8 }}
    >
      <Flex 
        direction="column" 
        align={{ base: "center", md: "flex-start" }} 
        mb={{ base: 8, md: 0 }} 
        mr={{ base: 0, md: 12 }}
        maxW={{ base: "100%", md: "400px" }}
        w="100%"
      >
        <Image 
          src="https://firebasestorage.googleapis.com/v0/b/sharefun-dc053.appspot.com/o/media%2Fimages%2Ffavicon2.png?alt=media&token=5cb32fc8-bd6d-4c81-8d75-ff5b642c0634" 
          alt="Quill Logo" 
          boxSize={{ base: "80px", md: "120px" }} 
          mb={4} 
        />
        <Text fontSize={{ base: "3xl", md: "5xl" }} fontWeight="bold" color="teal.400">QuillConnect</Text>
        <Text fontSize={{ base: "lg", md: "xl" }} mt="4" color="gray.300" textAlign={{ base: "center", md: "left" }}>
          Connect with friends and the world around you on QuillConnect.
        </Text>
      </Flex>

      <Box 
        p={8} 
        bg="gray.800" 
        rounded="md" 
        shadow="md" 
        w={{ base: "100%", md: "400px" }} 
        maxW="400px"
        mt={{ base: 4, md: 0 }}
      >
        <VStack spacing={6}>
          <Text fontSize="2xl" fontWeight="bold" color="teal.400">Create Account</Text>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4} align="stretch">
              <FormControl id="Name">
                <Input
                  type="text"
                  placeholder="Name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  bg="gray.700"
                  color="gray.300"
                  size="lg"
                />
              </FormControl>

              <FormControl id="UserName">
                <Input
                  type="text"
                  placeholder="User Name"
                  value={user.username}
                  onChange={(e) => setUser({ ...user, username: e.target.value })}
                  bg="gray.700"
                  color="gray.300"
                  size="lg"
                />
              </FormControl>

              <FormControl id="email">
                <Input
                  type="email"
                  placeholder="Email"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  required
                  bg="gray.700"
                  color="gray.300"
                  size="lg"
                />
              </FormControl>

              <FormControl id="password">
                <Input
                  type="password"
                  placeholder="Password"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  minLength={6} 
                  required
                  bg="gray.700"
                  color="gray.300"
                  size="lg"
                />
              </FormControl>

              <FormControl id="confirmPassword">
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6} 
                  required
                  bg="gray.700"
                  color="gray.300"
                  size="lg"
                />
              </FormControl>

              <Button type="submit" colorScheme="green" size="lg" width="full">
                Create a New Account
              </Button>
            </VStack>
          </form>

          <Text textAlign={'center'} color={'blue.200'} onClick={() => window.location.href='/login'} _hover={{cursor : "pointer"}}>Already have an account?</Text>

        </VStack>
      </Box>
    </Flex>
  );
};

export default RegisterPage;