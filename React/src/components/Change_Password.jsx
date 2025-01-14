import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
    const [Old_Password, setOldPassword] = useState('');
    const [New_Password, setNewPassword] = useState('');
    const navigate = useNavigate();

    const handlePassChange = async (e) => {
        e.preventDefault();

        try {
            // Retrieve the token from localStorage
            const token = localStorage.getItem('jwtToken');

            if (!token) {
                alert('User is not authenticated. Please log in.');
                return;
            }

            // Send the request with the token in the Authorization header
            const response = await axios.post(
                'http://localhost:3000/change',
                { Old_Password, New_Password },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include token here
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                alert('Password changed successfully!');
                navigate('/'); // Redirect to the home page or login
            } else {
                alert(`Error: ${response.data.message}`);
            }
        } catch (error) {
            if (error.response) {
                alert(`Error: ${error.response.data}`);
            } else {
                alert('An error occurred while changing the password.');
            }
        }
    };

    return (
        <>
        <div style={styles.container}>
           <div style={styles.formContainer}>
            <h2>Change Password</h2>
            <form id="change_password_form" onSubmit={handlePassChange} style={styles.form}>
                <label htmlFor="oldPassword" style={styles.label}>Old Password</label><br />
                <input
                    type="password"
                    id="Old_Password"
                    name="oldPassword"
                    value={Old_Password}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    style={styles.input}
                /><br /><br />

                <label htmlFor="newPassword" style={styles.label}>New Password</label><br />
                <input
                    type="password"
                    id="New_Password"
                    name="newPassword"
                    value={New_Password}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    style={styles.input}
                /><br /><br />

                <input type="submit" value="Submit" style={styles.button}/>
            </form>
            </div>
            </div>
        </>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
    formContainer: {
        backgroundColor: 'rgba(221, 229, 239, 0.8)',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(220, 54, 54, 0.1)',
        maxWidth: '400px',
        width: '100%',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    heading: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    label: {
        fontWeight: 'bold',
    },
    input: {
        padding: '10px',
        margin: '10px 0',
        borderRadius: '4px',
        border: '1px solid #ccc',
    },
    button: {
        padding: '10px',
        backgroundColor: 'rgba(37, 0, 245, 0.8)',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    switchButton: {
        padding: '10px',
        marginTop: '10px',
        backgroundColor: '#f1f1f1',
        border: '1px solid #ccc',
        cursor: 'pointer',
    },
};


export default ChangePassword;
