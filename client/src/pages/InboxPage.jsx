import React, { useContext } from 'react';
import { UserContext } from '../UserContext';
import RenelInboxPage from './RenelInboxPage';
import SHEPGCCInboxPage from './SHEPGCCInboxPage';
import LogInPage from './LogInPage';

function InboxPage() {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {!!user ? (
                user.userType === 'admin' ? (
                    <RenelInboxPage />
                ) : (
                    <SHEPGCCInboxPage />
                )
            ) : (
                <LogInPage />
            )}
        </div>
    );
}

export default InboxPage;
