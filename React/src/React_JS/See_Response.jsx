import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar_Instructor from './Sidebar_Instructor';
import Sidebar_Admin from './Sidebar_Admin';
function See_Response() {
    const { id } = useParams();
    const [students, setStudents] = useState([]);
    const navigate = useNavigate();
     const [role,setrole]=useState(null);
      const [errorMessage, setErrorMessage] = useState('');
         const [successfulMessage,setSuccessfullMessage]=useState('');
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const role=localStorage.getItem('role');
                const response = await axios.get(`http://localhost:3000/see_response/${id}`);
                setStudents(response.data.students);
               setrole(role);
            } catch (error) {
                setErrorMessage('Error fetching students:');
                setTimeout(() => setErrorMessage(''),700); 
               
            }
        };
        fetchStudents();
    }, [id]);

    const handleViewExamPaper = () => {
        navigate(`/see_exam/${id}`);
    };

    const handleViewAnswerSheet = (studentId) => {
        navigate(`/view_student_response/${studentId}/${id}`); // Navigate to the specific student's answer sheet
    };

    const styles = {
        container: {
            padding: '20px',
            fontFamily: 'Arial, sans-serif',
        },
        header: {
            textAlign: 'center',
            marginBottom: '20px',
        },
        title: {
            color: 'rgb(255, 255, 255)',
            fontSize: '4rem',
            textAlign: 'center',
            backgroundColor: 'rgb(88, 152, 178)',
            padding: '20px',
            borderRadius: '8px',
            margin: '20px auto',
            width: '75%',
            position:'fixed',
           marginLeft:'300px',
        },
        subtitle: {
            fontSize: '16px',
            color: '#555',
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'space-around',
            marginBottom: '20px',
            marginTop:'200px',
        },
        button: {
            padding: '10px 20px',
            backgroundColor: 'rgb(88, 152, 178)',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.3s',
        },
        buttonHover: {
            backgroundColor: 'rgb(162, 211, 230)',
        },
        tableContainer: {
            marginTop: '20px',
            width: '100%',
            borderCollapse: 'collapse',
        },
        table: {
            width: '75%',
            marginLeft:'300px',
            marginTop:'20px',
            border: '1px solid #ddd',
        },
        tableHeader: {
            backgroundColor: 'rgb(88, 152, 178)',
            color: 'white',
        },
        tableRow: {
            textAlign: 'left',
            borderBottom: '1px solid #ddd',
        },
        tableCell: {
            padding: '10px',
        },
        tableRowHover: {
            backgroundColor: '#f1f1f1',
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

    return (
        <>
            {errorMessage && (
      <div style={styles.errorMessage}>
        {errorMessage}
      </div>
    )}
    {successfulMessage && (<div style={styles.successfulMessage}>{successfulMessage}</div>)}
        <div style={{ display: 'flex', height: '100vh' }}>
           {role === 'Instructor' ? <Sidebar_Instructor /> : <Sidebar_Admin />}
            <div style={{ flexGrow: 1, padding: '20px', overflowY: 'auto' }}>
                <div style={styles.header}>
                    <h1 style={styles.title}>See Exam Paper</h1>
                </div>
                <div style={styles.buttonContainer}>
                    <button
                        style={styles.button}
                        onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                        onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                        onClick={handleViewExamPaper}
                    >
                        View Exam Paper
                    </button>
                </div>
                <h3>Student Responses</h3>
                {students.length > 0 ? (
                    <table style={styles.table}>
                        <thead style={styles.tableHeader}>
                            <tr>
                                <th style={styles.tableCell}>Student ID</th>
                                <th style={styles.tableCell}>Total Score</th>
                                <th style={styles.tableCell}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((student) => (
                                <tr
                                    key={student.Student_Id}
                                    style={styles.tableRow}
                                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.tableRowHover.backgroundColor)}
                                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                                >
                                    <td style={styles.tableCell}>{student.Student_id}</td>
                                    <td style={styles.tableCell}>{student.Total_Score}</td>
                                    <td style={styles.tableCell}>
                                        <button
                                            style={{
                                                ...styles.button,
                                                padding: '5px 10px',
                                                fontSize: '14px',
                                                backgroundColor: '#28a745',
                                            }}
                                            onClick={() => handleViewAnswerSheet(student.Student_Id)}
                                        >
                                            View Answer Sheet
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No responses found for this exam.</p>
                )}
            </div>
        </div>
        </>
    );
}

export default See_Response;
