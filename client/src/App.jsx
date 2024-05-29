import './App.css'
import {Route, Routes} from "react-router-dom";
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
    <UserContextProvider> 
      <Routes>
        <Route path="/login" element={<LogInPage/>} />
        <Route path="/" element={<HomePage/>} />
        <Route path="/renel_home" element={<RenelHomePage/>}/>
      </Routes>
    </UserContextProvider>
  )
}

export default App