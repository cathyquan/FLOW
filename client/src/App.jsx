import './App.css'
import {Route, Routes} from "react-router-dom";
import SHEPGCCHomePage from "./pages/SHEPGCCHomePage.jsx";
import SHEPGCCInboxPage from "./pages/SHEPGCCInboxPage.jsx";
import SHEPGCCProfilePage from "./pages/SHEPGCCProfilePage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/home" element={<SHEPGCCHomePage />} />
      <Route path="/inbox" element={<SHEPGCCInboxPage />} />
      <Route path="/profile" element={<SHEPGCCProfilePage />} />
    </Routes>
  )
}

export default App