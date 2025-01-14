import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//import Home from 'Home.webp';

function Index() {
    const [Id, setId] = useState('');
    const [Password, setPassword] = useState('');
    const [Mail_Id, setMailId] = useState('');
    const [Education, setEducation] = useState('');
    const [isSignup, setIsSignup] = useState(false); // Track whether to show login or signup
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/login', {
                id: Id,
                password: Password
            });

            if (response.status === 200) {
                const { role, token,Id } = response.data; // Get the role and token from the response
                localStorage.setItem('jwtToken', token);
                localStorage.setItem('role', role);
                localStorage.setItem('Id',Id);
              //  console.log(role+" "+Id);
                if(role === "user")
                    navigate('/user');
                else if(role === 'Admin')
                    navigate('/admin');
                else if(role === 'Instructor')
                    navigate('/instructor');
                
            } else {
                alert(`Error: ${response.data.message}`);
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred during login.');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/signup', {
                id: Id,
                password: Password,
                mail_id: Mail_Id,
                education: Education
            });

            if (response.status === 201) {
                alert('User registered successfully!');
                // Reset form fields after successful signup
                setId('');
                setPassword('');
                setMailId('');
                setEducation('');
                setIsSignup(false); // Switch back to login form
            } else {
                alert(`Error: ${response.data}`);
            }
        } catch (error) {
            if (error.response) {
                // If the error is from the backend
                alert(`Error: ${error.response.data}`);
            } else {
                alert('An error occurred during signup.');
            }
        }
    };

    return (
       // console.log(Home),

        <div style={styles.container}>
            <div style={styles.formContainer}>
                {isSignup ? (
                    <form id="signupForm" onSubmit={handleSignup} style={styles.form}>
                        <h2 style={styles.heading}>Sign Up</h2>
                        <label htmlFor="Id" style={styles.label}>ID:</label>
                        <input
                            type="text"
                            id="id"
                            name="id"
                            value={Id}
                            onChange={(e) => setId(e.target.value)}
                            required
                            style={styles.input}
                        /><br />

                        <label htmlFor="Password" style={styles.label}>Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={Password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        /><br />

                        <label htmlFor="MailId" style={styles.label}>Mail ID:</label>
                        <input
                            type="email"
                            id="mail_id"
                            name="mail_id"
                            value={Mail_Id}
                            onChange={(e) => setMailId(e.target.value)}
                            required
                            style={styles.input}
                        /><br />

                        <label htmlFor="Education" style={styles.label}>Education:</label>
                        <input
                            type="text"
                            id="education"
                            name="education"
                            value={Education}
                            onChange={(e) => setEducation(e.target.value)}
                            required
                            style={styles.input}
                        /><br />

                        <input type="submit" value="Submit" style={styles.button} />
                        <button type="button" onClick={() => setIsSignup(false)} style={styles.switchButton}>Switch to Login</button>
                    </form>
                ) : (
                    <form id="loginForm" onSubmit={handleSubmit} style={styles.form}>
                        <h2 style={styles.heading}>Log In</h2>
                        <label htmlFor="Id" style={styles.label}>ID:</label>
                        <input
                            type="text"
                            id="id"
                            name="id"
                            value={Id}
                            onChange={(e) => setId(e.target.value)}
                            required
                            style={styles.input}
                        /><br />

                        <label htmlFor="Password" style={styles.label}>Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={Password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        /><br />

                        <input type="submit" value="Submit" style={styles.button} />
                        <button type="button" onClick={() => setIsSignup(true)} style={styles.switchButton}>Switch to Sign Up</button>
                        <h3>In case of any query please contact YSExam@gmail.com</h3>
                    </form>
                )}
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'right',
        alignItems: 'center',
        height: '100vh',
         backgroundImage: 'url("/Homewebp")',
          
       // background: `url(${Home}) no-repeat center center/cover`,

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

export default Index;
