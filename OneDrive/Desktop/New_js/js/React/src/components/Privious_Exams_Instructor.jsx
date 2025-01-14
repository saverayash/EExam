import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { jwtDecode } from 'jwt-decode';
import Sidebar_Instructor from './Sidebar_Instructor.jsx';

function Exams() {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                if (token) {
                    const decoded = jwtDecode(token);
                    const Mail_Id = decoded.Mail_Id; 
                    const response = await axios.post('http://localhost:3000/privious_exams', { mail_id: Mail_Id });
                    
                    setExams(response.data);
                    setLoading(false);
                } else {
                    setError('Authentication Required');
                    setLoading(false);
                }
            } catch (e) {
                setError('Error fetching exams');
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

    if (loading) {
        return <h3>Loading...</h3>;
    }

    if (error) {
        return <h3>Error: {error}</h3>;
    }

    const handleExamClick = (id) => {
        navigate(`/see_response/${id}`);
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <Sidebar_Instructor />

            {/* Main Content */}
            <div style={{ flex: 1, padding: '20px' }}>
                <div style={styles.title}>Previous Exams</div>
                <div style={styles.examContainer}>
                    {exams.map((exam, index) => (
                        <div key={index} style={styles.examBox}>
                            <h3 style={styles.examTitle}>
                                <button
                                    onClick={() => handleExamClick(exam._id)}
                                    style={styles.examButton}
                                >
                                    {exam.Title}
                                </button>
                            </h3>
                            <div style={styles.examDetails}>
                                <p><b>Total Marks:</b> {exam.Total_Marks}</p>
                                <p><b>Start Time:</b> {new Date(exam.Start_Time).toLocaleString()}</p>
                                <p><b>End Time:</b> {new Date(exam.End_Time).toLocaleString()}</p>
                                <p><b>Duration:</b> {exam.Time} minutes</p>
                            </div>
                            {/* Play Button */}
                            <button
                                onClick={() => handleExamClick(exam._id)}
                                style={styles.playButton}
                            >
                                ▶ View Exam
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
const styles = {
    title: {
        color: 'rgb(255, 255, 255)',
        fontSize: '4rem',
        textAlign: 'center',
        backgroundColor: 'rgb(140, 139, 203)',
        padding: '20px',
        borderRadius: '8px',
        margin: '20px auto',
        width: '90%',
    },
    examContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '40px',
        justifyContent: 'center',
        marginTop: '15px',
    },
    examBox: {
        backgroundColor: 'rgb(254, 254, 254)',
        //padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 6px 12px rgba(44, 42, 42, 0.09)',
        width: '320px',
        textAlign: 'left',
    },
    examTitle: {
        fontSize: '2.5rem',
        margin: '0px',
        backgroundColor: 'rgb(140, 139, 203)',
        borderRadius: '10px',
        padding: '20px 15px',
        textAlign: 'left', // Align text to the left
        color: 'white',
        whiteSpace: 'nowrap',    // Prevent text from wrapping
        overflow: 'hidden',      // Hide overflow
        textOverflow: 'ellipsis', // Add ellipsis (...) when the text is too long
        width: '100%',            // Take up the full width of the container
        boxSizing: 'border-box',  // Ensure padding is included in width calculation
    },
    examButton: {
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        color: 'inherit',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        width: '100%',
    },
    examDetails: {
        padding: '10px',
        lineHeight: '1.8',
        fontSize: '1rem',
        color: 'rgb(50, 50, 50)',
        paddingTop: '5px',
        marginTop: '5px',
        borderRadius: '5px',
    },
    playButton: {
        marginBottom: '5px',
        marginLeft:'5px',
        padding: '10px 10px',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        backgroundColor: 'rgba(27, 133, 17, 0.68)', // Play button color
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        width: '96%', // Make the button fill the width
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
};

export default Exams;

