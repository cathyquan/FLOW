import React, { useContext } from 'react';
import { UserContext } from '../UserContext';
import RenelInboxPage from './RenelInboxPage';
import SchoolInboxPage from './SchoolInboxPage';
import LogInPage from './LogInPage'; 

function InboxPage() {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {!!user ? (
                user.userType === 'Administration' ? (
                    <RenelInboxPage />
                ) : (
                    <SchoolInboxPage />
                )
            ) : (
                <LogInPage />
            )}
        </div>
    );
}

export default InboxPage;
