import './App.css'
import {Route, Routes} from "react-router-dom";
import SHEPGCCHomePage from "./pages/SHEPGCCHomePage.jsx";
import LogInPage from "./pages/LogInPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import RenelHomePage from "./pages/RenelHomePage.jsx";
import axios from "axios";
import { UserContextProvider } from './UserContext.jsx';
import { useEffect } from 'react';

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <Routes>
      <Route path="/home" element={<SHEPGCCHomePage />} />
      <Route path="/inbox" element={<SHEPGCCInboxPage />} />
      <Route path="/profile" element={<SHEPGCCProfilePage />} />
      <Route path="/renel_home" element={<RenelHomePage/>}/>
      <Route path="/login" element={<LogInPage/>} />
    </Routes>
  )
}

export default App