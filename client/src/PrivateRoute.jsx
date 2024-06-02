import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { UserContext } from './UserContext';

const PrivateRoute = ({component: Component}) => {
    const {user} = useContext(UserContext);

    return(
        <Route>
            render={() =>
                user ? (
                    user.userType === 'admin' ? (
                      <Component userType="admin" />
                    ) : (
                      <Component userType="user" />
                    )
                  ) : (
                    <Redirect to="/login" />
                  )
            }
        </Route>
    );
};


export default PrivateRoute;