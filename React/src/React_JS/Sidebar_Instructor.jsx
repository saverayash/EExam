import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar_Instructor = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
    };
    const handleLogOut=()=>{
        localStorage.removeItem('jwtToken');  
        localStorage.removeItem('role');
        localStorage.removeItem('Id');
     
       navigate('/');
       }
    const styles = {
        sidebarOpen: {
            width: '250px',
            backgroundColor: '#2c3e50',
            color: 'white',
            padding: '20px',
            boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
            transition: 'width 0.3s',
            position:'fixed',
            height:'100vh',
            top:0,
            left:0,
           
        },
        sidebarCollapsed: {
            width: '50px',
            backgroundColor: '#2c3e50',
            color: 'white',
            padding: '10px 5px',
            boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
            transition: 'width 0.3s',
            textAlign: 'center',
            position:'fixed',
            height:'100vh',
            top:0,
            left:0,
        },
        toggleButton: {
            backgroundColor: 'transparent',
            color: 'white',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            marginBottom: '20px',
        },
        menu: {
            listStyleType: 'none',
            padding: 0,
        },
        menuItem: {
            fontSize: '1rem',
            padding: '10px 15px',
            cursor: 'pointer',
            borderRadius: '5px',
            marginBottom: '10px',
            transition: 'background 0.3s',
        },
    };

    return (
        <div style={isSidebarOpen ? styles.sidebarOpen : styles.sidebarCollapsed}>
            <button
                onClick={toggleSidebar}
                style={{
                    ...styles.toggleButton,
                    marginLeft: isSidebarOpen ? '200px' : '0px',
                }}
            >
                {isSidebarOpen ? '❮❮❮' : '❯❯❯'}
            </button>

            {isSidebarOpen && (
                <ul style={styles.menu}>
                    <li onClick={() => handleNavigation('/add_exam_paper')} style={styles.menuItem}>Add Exam Paper</li>
                    <li onClick={()=>handleNavigation('/privious_exams_instructor')} style={styles.menuItem}>See Exam Paper</li>
                    <li onClick={() => handleNavigation('/check_exam_paper')} style={styles.menuItem}>Check Exam Paper</li>
                    <li onClick={() => handleNavigation('/doubt_instructor')} style={styles.menuItem}>Answer Doubts</li>
                    <li onClick={()=>handleNavigation('/profile')} style={styles.menuItem}>Profile</li>
                    <li onClick={() => handleNavigation('/change_password')} style={styles.menuItem}>Change Password</li>
                    <li onClick={() => handleLogOut()} style={styles.menuItem}>Log Out</li>
                </ul>
               
            )}
        </div>
    );
};

export default Sidebar_Instructor;
