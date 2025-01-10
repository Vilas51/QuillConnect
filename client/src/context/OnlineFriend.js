import { createContext, useEffect, useState } from 'react';

// Create a UserContext
export const OnlineFriend = createContext();

// Create a provider component
export const OnlineFriendProvider = ({ children }) => {
  const [onlinefriends, setOnlineFriends] = useState([]);
  useEffect(()=>{
    console.log("use context online f: ", onlinefriends)
  },[onlinefriends])
  return (
    <OnlineFriend.Provider value={{ onlinefriends, setOnlineFriends }}>
      {children}
    </OnlineFriend.Provider>
  );
};