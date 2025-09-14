import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar_Admin from "./Sidebar_Admin";
import Sidebar_Instructor from "./Sidebar_Instructor";
import Sidebar_User from "./Sidebar_User";

function Profile() {
    const token = localStorage.getItem("jwtToken");
    const role = localStorage.getItem("role");
    const storedMailId = localStorage.getItem("Mail_Id");
     const [errorMessage, setErrorMessage] = useState('');
        const [successfulMessage,setSuccessfullMessage]=useState('');
    const [id, setId] = useState("");
    const [Mail_Id, setMail_Id] = useState("");
    const [Education, setEducation] = useState("");
    const [Experience, setExperience] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (!token || !role || !storedMailId) {
                    setErrorMessage('Authentication required.')
                    setTimeout(()=>setErrorMessage(''),500);
                   
                    return;
                }

                const response = await axios.post('http://localhost:3000/profile', {
                    Mail_Id: storedMailId,
                    role: role,
                });

                
                const data = response.data;
                setId(data._id);
                setMail_Id(data.Mail_Id);

                if (role === "Student") {
                    setEducation(data.Education || "N/A");
                } else {
                    setExperience(data.Experience || "N/A");
                }

                setLoading(false);
            } catch (error) {
                
                setErrorMessage('Faied to fecth Profile');
                setTimeout(()=>setErrorMessage(''),500);
               
                setLoading(false);
            }
        };

        fetchProfile();
    }, [role, storedMailId]);

    const styles = {
        pageContainer: {
            display: "flex",
            minHeight: "100vh",
            backgroundColor: "#f4f7fc",
        },
        sidebarContainer: {
            width: "250px",
        },
        contentWrapper: {
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
        },
        container: {
            width: "100%",
            maxWidth: "450px",
            padding: "25px",
            fontFamily: "Arial, sans-serif",
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.15)",
            textAlign: "center",
        },
        header: {
            color: "#007bff",
            fontSize: "26px",
            fontWeight: "bold",
            marginBottom: "20px",
        },
        profileInfo: {
            display: "flex",
            flexDirection: "column",
            gap: "12px",
        },
        infoRow: {
            display: "flex",
            justifyContent: "space-between",
            padding: "12px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
            fontSize: "16px",
        },
        label: {
            fontWeight: "bold",
            color: "#333",
        },
        value: {
            color: "#555",
        },
        error: {
            color: "red",
            textAlign: "center",
            fontSize: "16px",
        },
        loading: {
            textAlign: "center",
            fontSize: "18px",
            color: "#007bff",
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
        <div style={styles.pageContainer}>
           
            
                {role === "user" && <Sidebar_User />}
                {role === "Admin" && <Sidebar_Admin />}
                {role === "Instructor" && <Sidebar_Instructor />}
           

            {/* Profile Card */}
            <div style={styles.contentWrapper}>
                <div style={styles.container}>
                    <h2 style={styles.header}>Profile Information</h2>

                    {error && <p style={styles.error}>{error}</p>}
                    {loading ? (
                        <p style={styles.loading}>Loading...</p>
                    ) : (
                        <div style={styles.profileInfo}>
                            <div style={styles.infoRow}>
                                <span style={styles.label}>ID:</span>
                                <span style={styles.value}>{id}</span>
                            </div>
                            <div style={styles.infoRow}>
                                <span style={styles.label}>Email:</span>
                                <span style={styles.value}>{Mail_Id}</span>
                            </div>
                            {role === "Student" ? (
                                <div style={styles.infoRow}>
                                    <span style={styles.label}>Education:</span>
                                    <span style={styles.value}>{Education}</span>
                                </div>
                            ) : (
                                <div style={styles.infoRow}>
                                    <span style={styles.label}>Experience:</span>
                                    <span style={styles.value}>{Experience}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
    );
}

export default Profile;
