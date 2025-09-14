import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar_Instructor from './Sidebar_Instructor';
import Sidebar_Admin from './Sidebar_Admin';
import { jwtDecode } from 'jwt-decode';

function Check_Student_Response() {
    const { id } = useParams();
    const [students, setStudents] = useState([]);
    const navigate = useNavigate();
   
    const [errorMessage, setErrorMessage] = useState('');
    const [successfulMessage, setSuccessfulMessage] = useState('');
    const [role,setrole]=useState('');
    const [isToggled, setIsToggled] = useState(false);     
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const decoded = jwtDecode(token);
                const Mail_Id = decoded.Mail_Id; 
                const role=localStorage.getItem('role');
                setrole(role);
                if (!token) {
                    setErrorMessage("Authentication required");
                    setTimeout(() => setErrorMessage(''), 3000);
                    return;
                }

                const response = await axios.post(
                    `http://localhost:3000/check_exam_paper/${id}`,
                   {mail_id:Mail_Id,role:role}
                );
                 setIsToggled(response.data.status);
               
                setStudents(response.data.students);
            } catch (error) {
              
                setErrorMessage('Failed to fetch students');
                setTimeout(()=>setErrorMessage(''),3000);
            }
        };

        fetchStudents();
    }, [id]);

    const handleViewAnswerSheet = (studentId) => {
        navigate(`/check_student_response_manually/${studentId}/${id}`);
    };

    const handleToggle = async () => {
        setIsToggled((prev) => {
            const newState = !prev;
          
            return newState;
        });
    
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            setErrorMessage("Authentication required");
            setTimeout(() => setErrorMessage(''), 3000);
            return;
        }
    
        try {
            const decoded = jwtDecode(token);
            const Mail_Id = decoded.Mail_Id; 
            const role = localStorage.getItem('role');
            setrole(role);
    
            const response = await axios.post(
                `http://localhost:3000/check_exam_paper/toggle/${id}`,
                { mail_id: Mail_Id, role: role },
            );
            console.log(response);  // log the response to inspect
    
        } catch (error) {
            console.error(error);  // log the actual error for debugging
            setErrorMessage('Failed to publish result');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };
    


    const handleCheckPaper = async () => { 
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                setErrorMessage("Authentication required");
                setTimeout(() => setErrorMessage(''), 3000);
                return; 
            }
    
            const decoded = jwtDecode(token);
            const Mail_Id = decoded.Mail_Id; 
            
            const role = localStorage.getItem('role');
            setrole(role);
    
            const response = await axios.post(
                `http://localhost:3000/check_exam_paper/check/${id}`,
                { mail_id: Mail_Id, role: role }, 
                { headers: { Authorization: `Bearer ${token}` } } 
            );
    
            setStudents(response.data.students);
        } catch (error) {
           
            setErrorMessage('Failed to fetch students');
            setTimeout(() => setErrorMessage(''), 3000);
        }
    };
    

    const styles = {
        container: {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontFamily: "Arial, sans-serif",
        },
        label: {
            fontSize: "16px",
            marginLeft:'300px',
        },
        header: { textAlign: 'center', marginBottom: '20px' },
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
        title2: {
            color: 'rgb(255, 255, 255)',
            fontSize: '3.5rem',
            textAlign: 'center',
            backgroundColor: 'rgb(88, 152, 178)',
            padding: '20px',
            borderRadius: '8px',
            margin: '10px auto',
            width: '78%',
           // position:'fixed',
           marginLeft:'300px',
           marginTop:'25px',
        },
        buttonContainer: { display: 'flex', justifyContent: 'center', marginBottom: '20px',marginTop:'200px' },
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
        buttonHover: { backgroundColor: '#0056b3' },
        table: { width: '75%', border: '1px solid #ddd', marginTop: '20px', borderCollapse: 'collapse',marginLeft:'300px' },
        tableHeader: { backgroundColor: 'rgb(88, 152, 178)', color: 'white' },
        tableRow: { textAlign: 'left', borderBottom: '1px solid #ddd' },
        tableCell: { padding: '10px' },
        
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
        toggleContainer: {
            position: "relative",
            width: "60px",
            height: "30px",
            backgroundColor: "white",
            borderRadius: "30px",
            border: "2px solid rgba(151, 102, 102, 0.1)",
            cursor: "pointer",
            transition: "background-color 0.3s",
            marginLeft:'300px',
        },
        toggleButton: {
            position: "absolute",
            top: "4px",
            left: "4px",
            width: "22px",
            height: "22px",
            backgroundColor: "#fff",
            borderRadius: "50%",
            transition: "transform 0.3s",
        },
        status: {
            fontSize: "14px",
            fontWeight: "bold",
        },
    };

    return (
        <>
            {errorMessage && <div style={styles.errorMessage}>{errorMessage}</div>}
            {successfulMessage && <div style={styles.successfulMessage}>{successfulMessage}</div>}
            <div style={{ display: 'flex', height: '100vh' }}>
            {role === 'Instructor' ? <Sidebar_Instructor /> : <Sidebar_Admin />}
                <div style={{ flexGrow: 1, padding: '20px', overflowY: 'auto' }}>
                    <div style={styles.header}>
                        <h1 style={styles.title}>Check Exam Paper</h1>
                    </div>
                    <div style={styles.buttonContainer}>
                        <button
                            style={styles.button}
                            onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                            onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                            onClick={handleCheckPaper}
                        >
                            Check Exam Paper
                        </button>
                    </div>
                    <div style={styles.container}>
            <span style={styles.label}>Can student see their response:</span>
            <div onClick={handleToggle} style={styles.toggleContainer}>
                <div 
                    style={{
                        ...styles.toggleButton,
                        backgroundColor: isToggled ? "#4CAF50" : "#ccc",
                        transform: isToggled ? "translateX(26px)" : "translateX(0)"
                    }}
                ></div>
            </div>
            <span style={styles.status}>{isToggled ? "Yes" : "No"}</span>
        </div>
                    <div style={styles.title2}>Students Result</div>
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
                                    <tr key={student.Student_Id} style={styles.tableRow}>
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
                                                Check Answer Sheet
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

export default Check_Student_Response;
