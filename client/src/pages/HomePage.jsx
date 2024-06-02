import React, { useContext } from 'react';
import { UserContext } from '../UserContext';
import RenelHomePage from './RenelHomePage';
import SHEPGCCHomePage from './SHEPGCCHomePage';

function App() {
    const { user } = useContext(UserContext);
    return (
        <div>
            {!!user && user.userType === 'admin' ? (
                <RenelHomePage/>
            ) : (
                !!user && (
                    <SHEPGCCHomePage/>
                )
            )}
        </div>
    );
}

export default App;