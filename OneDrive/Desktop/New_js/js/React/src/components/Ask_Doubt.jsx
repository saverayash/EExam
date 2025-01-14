import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
function Ask_Doubt() {
  const [doubt, setDoubt] = useState('');
  const navigate = useNavigate();

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
          alert('Your doubt was placed successfully, we will try our best to answer your question');
          navigate('/user');
        } else {
          alert(`Error: ${response.data.message}`);
        }
      } else {
        alert('No token found. Please log in.');
      }
    } catch (error) {
      if (error.response) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('An error occurred while submitting your doubt');
      }
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

  return (
    <div style={formStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#444' }}>
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
  );
}

export default Ask_Doubt;
