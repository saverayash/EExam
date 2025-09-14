import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar_Admin from './Sidebar_Admin';
import Sidebar_Instructor from './Sidebar_Instructor';
import Sidebar_User from './Sidebar_User';

function ChangePassword() {
    const [Old_Password, setOldPassword] = useState('');
    const [New_Password, setNewPassword] = useState('');
    const navigate = useNavigate();
    const [role,setrole]=useState('');
    const [Mail_Id,setMailId]=useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successfulMessage,setSuccessfullMessage]=useState('');
    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        const storedMailId = localStorage.getItem('Mail_Id');
        if (storedRole) setrole(storedRole);
        if (storedMailId) setMailId(storedMailId);
    }, []);
    
  
    const handlePassChange = async (e) => {
        e.preventDefault();

        try {
           
            const token = localStorage.getItem('jwtToken');
           
            if (!token) {
                setErrorMessage('User is not authenticated. Please log in.');
                setTimeout(() => setErrorMessage(''),700); 
                return;
            }

           console.log(Old_Password+" "+New_Password+" "+Mail_Id+" "+role);
           const response = await axios.post(
            'http://localhost:3000/change',
            { 
                Old_Password, 
                New_Password, 
                Mail_Id, 
                role 
            });
           console.log(response);
            if (response.status === 200) {
                setSuccessfullMessage('Password changed successfully!');
                setTimeout(() => {
                    setSuccessfullMessage('');
                    if (role === 'user') navigate('/user');
                    else if (role === 'Instructor') navigate('/instructor');
                    else if (role === 'Admin') navigate('/admin');
                }, 5000);
            } else {
                setErrorMessage('Please enter your Password Correctly or New Password does not follow Password requirement');
                setTimeout(() => setErrorMessage(''),700); 
               
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage('Please enter your Password Correctly or New Password does not follow Password requirement');
                setTimeout(() => setErrorMessage(''),700); 
              
            } else {
                setErrorMessage('An error occurred while changing the password.');
                setTimeout(() => setErrorMessage(''),700); 
              
            }
        }
    };

    return (
        <>
         {errorMessage && (
      <div style={styles.errorMessage}>
        {errorMessage}
      </div>
    )}
    {successfulMessage && (<div style={styles.successfulMessage}>{successfulMessage}</div>)}
       <div style={{ display: 'flex', minHeight: '100vh' }}>
         {role === 'user' && <Sidebar_User />}
    {role === 'Admin' && <Sidebar_Admin />}
    {role === 'Instructor' && <Sidebar_Instructor />}
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
            </div>
        </>
    );
}

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        height: '100vh',
        marginLeft:'700px',
    },
    formContainer: {
        backgroundColor: 'rgba(221, 229, 239, 0.8)',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(220, 54, 54, 0.1)',
        width: '500px',
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
    errorMessage:{
        position: 'fixed',
    top: '5%',  // Adjust the distance from the top if needed
    left: '50%',
    transform: 'translateX(-50%)',  // Centers horizontally
    width: '30%',
    padding: '1rem',
    backgroundColor: '#f56565',  // Red background
    color: 'white',
    borderRadius: '0.375rem',  // Rounded corners
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'opacity 0.5s',  // Optional transition
    
    },
     
    successfulMessage:{
        position: 'fixed',
    top: '5%',  // Adjust the distance from the top if needed
    left: '50%',
    transform: 'translateX(-50%)',  // Centers horizontally
    width: '30%',
    padding: '1rem',
    backgroundColor: 'rgba(94, 187, 40, 0.5)',  // Red background
    color: 'white',
    borderRadius: '0.375rem',  // Rounded corners
    boxShadow: '0 4px 6px rgba(169, 236, 96, 0.1)',
    transition: 'opacity 0.5s',  // Optional transition
    
    },
};


export default ChangePassword;
