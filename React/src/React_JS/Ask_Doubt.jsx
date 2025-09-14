import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import Sidebar_User from './Sidebar_User';
 
function Ask_Doubt() {
  const [doubt, setDoubt] = useState('');
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [successfulMessage,setSuccessfullMessage]=useState('');
  const handler = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken'); 
      if (token) {
        const decoded = jwtDecode(token);
        const Mail_Id = decoded.Mail_Id; 
  
        const response = await axios.post('http://localhost:3000/ask', {
          Text: doubt,
          Mail_Id: Mail_Id
        });
  
        if (response.status === 200 || response.status === 201) {
          setSuccessfullMessage("Your doubt was placed successfully, we will try our best to answer your question")
          setTimeout(()=>{
           setSuccessfullMessage('');
           navigate('/user');
          },5000);
        
        } else {
          setErrorMessage(response.data.message);
          setTimeout(()=>setErrorMessage(''),5000);
        }
      } else {
        setErrorMessage('Authentification required');
          setTimeout(()=>setErrorMessage(''),5000);
      }
    } catch (error) {
      setErrorMessage('Authentification required');
      setTimeout(()=>setErrorMessage(''),5000);
    }
  };
  

  const formStyle = {
    width: '400px',
    margin: '200px auto',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#f9f9f9',
  };

  const labelStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '10px',
    display: 'block',
    color: '#333',
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '14px',
    boxSizing: 'border-box',
  };

  const submitButtonStyle = {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'block',
    width: '100%',
  };

  const submitHoverStyle = {
    backgroundColor: '#45a049',
  };
  const styles=
  {
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
    <div style={{ display: 'flex', minHeight: '100vh' }}>
    <Sidebar_User/>
    <div style={formStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: 'rgb(88, 152, 178)' }}>
        Ask Your Doubt
      </h2>
      <form id="Ask_DoubtForm" onSubmit={handler}>
        <label htmlFor="Doubt" style={labelStyle}>
          Doubt
        </label>
        <input
          type="text"
          id="Doubt"
          name="Doubt"
          value={doubt}
          onChange={(e) => setDoubt(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          type="submit"
          value="Submit"
          style={submitButtonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = submitHoverStyle.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = submitButtonStyle.backgroundColor)}
        />
      </form>
    </div>
    </div>
    </>
  );
}

export default Ask_Doubt;
