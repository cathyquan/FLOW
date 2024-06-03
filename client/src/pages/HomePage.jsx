import React, { useContext } from 'react';
import { UserContext } from '../UserContext';
import RenelHomePage from './RenelHomePage';
import SHEPGCCHomePage from './SHEPGCCHomePage';
import LogInPage from './LogInPage';

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
                    <SHEPGCCHomePage />
                )
            ) : (
                <LogInPage />
            )}
        </div>
    );
}

export default App;
