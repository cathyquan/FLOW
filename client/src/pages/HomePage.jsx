import React, {useContext} from 'react';
import {UserContext} from '../UserContext';

function App() {
    const {user} = useContext(UserContext);
    if (user.email === "renel@gmail.com") {
        return (
            <div>
                {!!user && (
                    <div>
                        {user.email}
                    </div>
                )}
                Admin page
            </div>
        );
    } else {
        return (
            <div>
                {!!user && (
                    <div>
                        {user.email}
                    </div>
                )}
                Home page
            </div>
        );
    }

}

export default App;