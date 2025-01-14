import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar_User from './Sidebar_User.jsx';
import { jwtDecode } from 'jwt-decode';

function Doubt_Student() {
    const [doubts, setDoubt] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
                    setError('Authentication Required');
                    setLoading(false);
                }
            } catch (e) {
                setError('Error fetching doubts');
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
            <div style={styles.container}>
                <Sidebar_User />
                <div style={styles.content}>
                    <div style={styles.title}>Doubts</div>
                    <div>
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
        backgroundColor: 'rgb(140, 139, 203)',
        padding: '20px',
        borderRadius: '8px',
        margin: '10px auto',
        width: '95%',
        marginBottom:'70px',
    },
    doubtCard: {
        padding: '10px',
        marginBottom: '18px',
        borderRadius: '8px',
        fontSize:'1.2rem',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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
};

export default Doubt_Student;
