import React, { useContext } from 'react';
import Home from './pages/home';
import Profile from './pages/profile';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import NoPage from './pages/NoPage';
import EditDetails from './pages/editDetails';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserContext } from './context/UserContext'; // Assuming you're using UserContext for user data
import Messenger from './pages/messenger'
import { useEffect, useState } from 'react';
import axios from 'axios';
import BookmarkPage from './pages/bookmark';

function App() {
  const selfUserId = useContext(UserContext).userId;
  console.log("userId", selfUserId)
  const [user, setUser] = useState(null); // State to hold user data

  useEffect(() => { 
    if (selfUserId != null) {
      const fetchUser = async () => {
        try {
          console.log("Process.env",process.env.R)
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/getUser/${selfUserId}`);
          setUser(response.data.data);
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      };
      fetchUser();
    }
  }, [selfUserId]);
  return (
   
    <BrowserRouter>
      <Routes>
        {/* Home page */}
        <Route path="/" element={<Home />} />
        
        {/* Profile routes: 
            - /profile for current user 
            - /profile/:id for other users */}
        <Route 
          path="/profile" 
          element={ <Profile user={user} />} // Current user profile
        />
        <Route path="/profile/:id" element={<Profile />} /> {/* Other user profile */}
        
        {/* Login and Register */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path='/editDetails' element={<EditDetails/>} />

        <Route path='/messenger' element={ <Messenger/>} />

        <Route path='/bookmarks' element={ <BookmarkPage/>} />
        
        {/* No match route */}
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
