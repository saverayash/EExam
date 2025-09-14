import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar_User from './Sidebar_User.jsx';
import { jwtDecode } from 'jwt-decode';

function Doubt_Student() {
    const [doubts, setDoubt] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
        const [successfulMessage,setSuccessfullMessage]=useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoubts = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                if (token) {
                    const decoded = jwtDecode(token);
                    const Mail_Id = decoded.Mail_Id;

                    const response = await axios.post('http://localhost:3000/doubt_student', { Mail_Id: Mail_Id });
                    setDoubt(response.data);
                    setLoading(false);
                } else {
                    setErrorMessage('Authentication Required');
                    setTimeout(() => setErrorMessage(''),700); 
                    setLoading(false);
                }
            } catch (e) {
                setErrorMessage('Error fetching doubts');
                setTimeout(() => setErrorMessage(''),700); 
               
                setLoading(false);
            }
        };
        fetchDoubts();
    }, []);

    if (loading) {
        return <h3>Loading...</h3>;
    }

    if (error) {
        return <h3>Error: {error}</h3>;
    }

    return (
        <>
            {errorMessage && (
      <div style={styles.errorMessage}>
        {errorMessage}
      </div>
    )}
    {successfulMessage && (<div style={styles.successfulMessage}>{successfulMessage}</div>)}
            <div style={styles.container}>
                <Sidebar_User />
                <div style={styles.content}>
                    <div style={styles.title}>Doubts</div>
                    <div style={styles.dbox}>
                        {doubts.length > 0 ? (
                            doubts.map((doubt, index) => (
                                <div
                                    key={index}
                                    style={{
                                        ...styles.doubtCard,
                                        backgroundColor: doubt.Answer === null ? '#fff3cd' : '#d4edda',
                                    }}
                                    
                                >
                                    <div style={styles.question}>Q: {doubt.Question}</div>
                                    <div style={styles.answer}>
                                        A: {doubt.Answer || 'Awaiting response from instructor...'}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No doubts found.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
    },
    content: {
        flex: 1,
        padding: '20px',
    },
    title: {
        color: 'rgb(255, 255, 255)',
        fontSize: '4rem',
        textAlign: 'center',
        backgroundColor: 'rgb(88, 152, 178)',
        padding: '20px',
        borderRadius: '8px',
        margin: '10px auto',
       
        marginBottom:'70px',
        width: '75%',
        position:'fixed',
       marginLeft:'300px',
    },
    dbox:{
        marginTop:'200px',
     },
    doubtCard: {
        padding: '10px',
        marginBottom: '18px',
        borderRadius: '8px',
        fontSize:'1.2rem',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        marginLeft:'300px',
    },
    question: {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '10px',
    },
    answer: {
        fontSize: '16px',
        color: '#333',
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

export default Doubt_Student;
