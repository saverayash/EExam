import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import Sidebar_Admin from './Sidebar_Admin.jsx';

function Admin() {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            const decoded = jwtDecode(token);
            setUserData(decoded);
        }
    }, []);

    return (
        <div style={styles.container}>
            <Sidebar_Admin />
            <div style={styles.mainContent}>
                {userData ? (
                    <p><b>Welcome Back {userData.Mail_Id}</b></p>
                ) : (
                    <p>No user data found</p>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        height: '100vh',
           //background: `url(${Background}) no-repeat center center/cover`,
    },
    mainContent: {
        flex: 1,
        padding: '20px',
        overflow: 'auto',
        marginLeft:'300px',
    },
};

export default Admin;