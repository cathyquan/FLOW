import React, {useContext} from 'react';
import {UserContext} from '../UserContext';

function App() {
    const {user} = useContext(UserContext);
   return(
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

export default App;