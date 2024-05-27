import './App.css'
import {Route, Routes} from "react-router-dom";
import LogInPage from "./pages/LogInPage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LogInPage />} />
    </Routes>
  )
}

export default App
