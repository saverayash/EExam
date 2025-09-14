import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar_Instructor from './Sidebar_Instructor.jsx';
import { jwtDecode } from 'jwt-decode';

function Doubt_Instructor() {
    const [doubts, setDoubt] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedDoubt, setSelectedDoubt] = useState(null);
    const [answer, setAnswer] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoubts = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                if (token) {
                    const decoded = jwtDecode(token);
                    const Mail_Id = decoded.Mail_Id;

                    const response = await axios.post('http://localhost:3000/doubt_instructor', { Mail_Id: Mail_Id });
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

    const handleOpenModal = (doubt) => {
        setSelectedDoubt(doubt);
        setAnswer(doubt.Answer || '');
    };

    const handleCloseModal = () => {
        setSelectedDoubt(null);
        setAnswer('');
    };

    const handleSubmitAnswer = async () => {
        if (!answer) return;

        try {
            const token = localStorage.getItem('jwtToken');
            if (token) {
                const decoded = jwtDecode(token);
                const Mail_Id = decoded.Mail_Id;

                await axios.post('http://localhost:3000/answer_doubt', {
                    doubtId: selectedDoubt._id,
                    answer: answer,
                    Mail_Id:Mail_Id,
                });
    
                // Update the doubts list locally
                const updatedDoubts = doubts.map(d =>
                    d._id === selectedDoubt._id ? { ...d, Answer: answer } : d
                );
    
                setDoubt(updatedDoubts);
                handleCloseModal();
            } else {
                setError('Authentication Required');
                setLoading(false);
            }
           
        } catch (e) {
            setError('Failed to submit answer');
        }
    };

    if (loading) {
        return <h3>Loading...</h3>;
    }

    if (error) {
        return <h3>Error: {error}</h3>;
    }

    return (
        <>
            <div style={styles.container}>
                <Sidebar_Instructor />
                <div style={styles.content}>
                    <div style={styles.title}>Doubts</div>
                    <div style={styles.dbox}>
                        {doubts.length > 0 ? (
                            doubts.map((doubt, index) => (
                                <div
                                    key={index}
                                    style={{
                                        ...styles.doubtCard,
                                        backgroundColor: doubt.Answer ? '#d4edda' : '#fff3cd',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => handleOpenModal(doubt)}
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

            {selectedDoubt && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h2>Answer Doubt</h2>
                        <p><strong>Q: {selectedDoubt.Question}</strong></p>
                        <textarea
                            style={styles.textarea}
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="Write your answer here..."
                        />
                        <div style={styles.modalActions}>
                            <button onClick={handleSubmitAnswer} style={styles.submitButton}>Post Answer</button>
                            <button onClick={handleCloseModal} style={styles.cancelButton}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const styles = {
    container: {
        display: 'flex',
        minHeight: '100vh',
    },
    dbox:{
       marginTop:'200px',
    },
    content: {
        flex: 1,
        padding: '20px',
    },
    title: {
        color: 'white',
        fontSize: '4rem',
        textAlign: 'center',
        backgroundColor: 'rgb(88, 152, 178)',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '70px',
        width: '75%',
        position:'fixed',
       marginLeft:'300px',
    },
    doubtCard: {
        padding: '10px',
        marginBottom: '18px',
        borderRadius: '8px',
        fontSize:'1.2rem',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
       marginLeft:'300px',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        width: '500px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    textarea: {
        width: '100%',
        height: '100px',
        marginTop: '10px',
    },
    modalActions: {
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'space-between',
    },
    submitButton: {
        backgroundColor: 'green',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
    },
    cancelButton: {
        backgroundColor: 'red',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
    },
};

export default Doubt_Instructor;
