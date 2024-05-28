import './App.css'
import {Route, Routes} from "react-router-dom";
import RenelHomePage from "./pages/RenelHomePage.jsx";

function App() {
    return (
        <Routes>
            <Route path="/renel_home" element={<RenelHomePage/>}/>
        </Routes>
    )
}

export default App
