import React, { useContext } from 'react';
import { UserContext } from '../UserContext';
import RenelHomePage from './RenelHomePage';
import LogInPage from './LogInPage';
import HomePage_new from "./HomePage_new.jsx";


function App() {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {!!user ? (
                user.userType === 'admin' ? (
                    <RenelHomePage />
                ) : (
                    <HomePage_new />
                )
            ) : (
                <LogInPage />
            )}
        </div>
    );
}

export default App;
