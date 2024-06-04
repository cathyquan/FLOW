import './App.css'
import {Route, Routes} from "react-router-dom";
import LogInPage from "./pages/LogInPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import RenelHomePage from "./pages/RenelHomePage.jsx";
import SHEPGCCHomePage from "./pages/SHEPGCCHomePage.jsx";
import SHEPGCCInboxPage from "./pages/SHEPGCCInboxPage.jsx";
import SHEPGCCProfilePage from "./pages/SHEPGCCProfilePage.jsx";
import GradeLevelPage from "./pages/GradeLevelPage.jsx";

import axios from "axios";
import { UserContextProvider } from './UserContext.jsx';
import { useEffect } from 'react';

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider> 
      <Routes>
        <Route path="/login" element={<LogInPage/>} />
        <Route path="/" element={<HomePage/>} />
        <Route path="/profile" element={<SHEPGCCProfilePage />} />
        <Route path="/inbox" element={<SHEPGCCInboxPage />} />
        <Route path="/gradelevel" element={<GradeLevelPage />} />
      </Routes>
    </UserContextProvider>
  )
}

export default App