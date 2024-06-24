// src/components/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserContext } from '../UserContext';

const PrivateRoute = ({ redirectPath = '/login' }) => {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to={redirectPath} />;
    }

    return <Outlet />;
};

export default PrivateRoute;
