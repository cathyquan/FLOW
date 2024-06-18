// src/App.jsx
import './App.css';
import { Route, Routes } from 'react-router-dom';
import LogInPage from './pages/LogInPage.jsx';
import HomePage from './pages/HomePage.jsx';
import SHEPGCCHomePage from './pages/SHEPGCCHomePage.jsx';
import GradeLevelPage from './pages/GradeLevelPage.jsx';
import AttendanceChecklist from './pages/AttendanceChecklist.jsx';
import InboxPage from './pages/InboxPage.jsx';
import SHEPGCCProfilePage from './pages/SHEPGCCProfilePage.jsx';
import SHEPGCCStudentPage from './pages/SHEPGCCStudentPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import { UserContextProvider } from './UserContext.jsx';
import { useEffect } from 'react';

import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/login" element={<LogInPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<SHEPGCCProfilePage />} />
          <Route path="/school/:id" element={<SHEPGCCHomePage />} />
          <Route path="/grades/:gradeId" element={<GradeLevelPage />} />
          <Route path="/attendance" element={<AttendanceChecklist />} />
          <Route path="/students/:studentId" element={<SHEPGCCStudentPage />} />
          <Route path="/inbox" element={<InboxPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
