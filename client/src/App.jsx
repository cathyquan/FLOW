import './App.css'
import {Route, Routes} from "react-router-dom";
// import LogInPage from "./pages/LogInPage.jsx";
import SHEPGCCHomePage from "./pages/SHEPGCCHomePage.jsx";

function App() {
  return (
    <Routes>
      {/* <Route path="/login" element={<LogInPage />} /> */}
      <Route path="/home" element={<SHEPGCCHomePage />} />
    </Routes>
  )
}

export default App