import React, { useContext } from 'react';
import { useState } from "react";
import '../App.css';
import logo from "../assets/logo.png"
import axios from "axios";
import { Navigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

function App() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUser} = useContext(UserContext);

    async function handleLoginSubmit(ev){
        ev.preventDefault();
        try{
            const {data} = await axios.post('http://localhost:4000/login', {email, password}); 
            if(data.email){
                setUser(data);
                alert('Login successful!');
                setRedirect(true);
            }
            else{
                alert('Login failed');
            }
        } catch(e){
            alert('Login failed');
        }
    }
    
    if(redirect){
        return <Navigate to={'/'} />;
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <img src={logo} alt="Renel Ghana Foundation" className="w-32 mb-8" />
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold">
            Welcome to <span className="italic font-normal">FLOW</span>!
          </h1>
        </div>
        <div className="bg-white p-8 rounded-md w-full max-w-md">
          <form className="space-y-4" onSubmit={handleLoginSubmit}>
            <div>
              <input
                type="email" 
                name="email"
                id="email"
                placeholder="your@email.com" 
                value={email}
                onChange={ev => setEmail(ev.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-gray-400 focus:border-gray-400 text-center"
              />
            </div>
            <div>
              <input
                type="password" 
                name="password"
                id="password"
                placeholder="password" 
                value={password}
                onChange={ev => setPassword(ev.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-gray-400 focus:border-gray-400 text-center"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-3 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-RenelOrange hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-RenelOrange"
              >
                Log In
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  
  export default App;