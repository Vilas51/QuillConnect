import React, { useRef, useState, useContext } from 'react';
import { Box, Flex, Input, Avatar, Button, Text, Icon , Image, Spinner} from '@chakra-ui/react';
import { FaCamera, FaTag, FaMapMarkerAlt, FaSmile } from 'react-icons/fa';
import { UserContext } from '../context/UserContext';
import axios from 'axios';
import { useEffect } from 'react';
import { storage } from '../firebase'; // Import storage from firebase.js
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Share = () => {
  const [fileData, setFileData] = useState({ caption: '', file: null }); // Initialize fileData as an object
  const fileInputRef = useRef(null); // Create a ref for the file input
  const [loading, setLoading] = useState(false); // Loading state for the share button
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
  }, []);



  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileData((prevData) => ({
      ...prevData,
      file,
    }));
    console.log(file); // Log the selected file
  };

  // Trigger hidden file input click
  const handleFileClick = () => {
    fileInputRef.current.click();
  };

  const shareHandler = async () => {
    try {
      // Check if a file has been selected
      setLoading(true);
      var downloadURL = "";
      if (fileData.file) {
              // Create a storage reference
          //check type of file : img or video
          const storagePath = fileData.file.type.includes('image') 
                              ? "media/images/" 
                              : "media/videos/";

          const storageRef = ref(storage, `${storagePath}${fileData.file.name}`);
      
          // Upload file to storage
          const snapshot = await uploadBytes(storageRef, fileData.file);
          
          // Check if the snapshot is valid
          if (!snapshot) {
            throw new Error('File upload failed');
          }
      
          // Get download URL
          downloadURL = await getDownloadURL(storageRef);
          
          console.log('File uploaded to:', downloadURL);
      }
      
      setLoading(false);

  
      // Now send the post request to your backend
      const newPost = await axios.post(`${process.env.REACT_APP_API_URL}/api/posts`, {
        media: downloadURL ,  // Ensure this is the download URL, not the raw file
        caption: fileData.caption,
        userId: user._id,
      });
  
      window.location.reload();
      console.log(newPost.data);
      
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };
  

  return (
    user ? 
    (<Box maxWidth="550px" borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} mt={3}>
      <Flex alignItems="center" mb={4}>
        <Avatar
          size="md"
          src= {user.profilePicture}
          mr={3}
        />
        <Input
          placeholder={`What's in your mind ${user.name}?`}
          variant="unstyled"
          value={fileData.caption}
          onChange={(e) =>
            setFileData((prevData) => ({
              ...prevData,
              caption: e.target.value,
            }))
          }
        />
      </Flex>
      {fileData.file && <Image src={URL.createObjectURL(fileData.file)} mb={3} alt="Selected Media" 
              borderRadius="md"
              objectFit="cover" // Crop to fit
              width="100%" // Responsive width
              maxH="400px" // Set max height
              height="auto" // Maintain aspect ratio
              />}
      <Flex justifyContent="space-between" alignItems="center">
        <Flex>
          {/* Photo or Video Button */}
          <Button onClick={handleFileClick} leftIcon={<Icon as={FaCamera} />} variant="ghost" colorScheme="red" size="sm" mr={2}>
            <Text fontSize="sm">Photo or Video</Text>
          </Button>
          {/* Hidden file input */}
          <Input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />

          {/* Tag Button */}
          <Button leftIcon={<Icon as={FaTag} />} variant="ghost" colorScheme="blue" size="sm" mr={2}>
            <Text fontSize="sm">Tag</Text>
          </Button>

          {/* Location Button */}
          <Button leftIcon={<Icon as={FaMapMarkerAlt} />} variant="ghost" colorScheme="green" size="sm" mr={2}>
            <Text fontSize="sm">Location</Text>
          </Button>

          {/* Feelings Button */}
          <Button leftIcon={<Icon as={FaSmile} />} variant="ghost" colorScheme="yellow" size="sm">
            <Text fontSize="sm">Feelings</Text>
          </Button>
        </Flex>
        <Button colorScheme="green" size="sm" ml={2} onClick={shareHandler}>
          {loading ? <Spinner size="sm" /> : <Text size={'sm'} fontFamily={'monospace'}>Share</Text>}
        </Button>
      </Flex>
    </Box>) : <Spinner />
  );
};

export default Share;
