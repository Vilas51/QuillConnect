import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { UserProvider } from './context/UserContext';
import { OnlineFriendProvider } from './context/OnlineFriend';
// 1. import `ChakraProvider` component
import { ChakraProvider } from '@chakra-ui/react'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode> 
    <ChakraProvider>
      <UserProvider> 
        <OnlineFriendProvider>
          <App />
        </OnlineFriendProvider>
      </UserProvider>
    </ChakraProvider>
  </React.StrictMode>
);
