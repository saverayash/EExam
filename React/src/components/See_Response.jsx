import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar_Instructor from './Sidebar_Instructor';

function See_Response() {
    const { id } = useParams();
    const [students, setStudents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/see_response/${id}`);
                setStudents(response.data.students);
                //console.log(response.data);
            } catch (error) {
                console.error('Error fetching students:', error);
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
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '10px',
        },
        subtitle: {
            fontSize: '16px',
            color: '#555',
        },
        buttonContainer: {
            display: 'flex',
            justifyContent: 'space-around',
            marginBottom: '20px',
        },
        button: {
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background-color 0.3s',
        },
        buttonHover: {
            backgroundColor: '#0056b3',
        },
        tableContainer: {
            marginTop: '20px',
            width: '100%',
            borderCollapse: 'collapse',
        },
        table: {
            width: '100%',
            border: '1px solid #ddd',
        },
        tableHeader: {
            backgroundColor: '#007bff',
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
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <Sidebar_Instructor />
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
    );
}

export default See_Response;
