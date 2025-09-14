import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
function Add_Another() {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    option: '',
    Id: '',
    Password: '',
    Mail_Id: '',
    Education: '',
    My_Mail_Id:'',
  });
   const [errorMessage, setErrorMessage] = useState('');
      const [successfulMessage,setSuccessfullMessage]=useState('');
  const handleBackToHome = () => {
    navigate('/admin'); // Redirect to the home page (adjust path as needed)
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const token = localStorage.getItem("jwtToken");
            if (!token) throw new Error("Authorization required.");
            const decoded = jwtDecode(token);
            const My_Mail_Id = decoded.Mail_Id;
            formData.My_Mail_Id=My_Mail_Id;
      const response = await axios.post('http://localhost:3000/add', formData);
      setSuccessfullMessage('Person Added Successfully');
      setTimeout(() => setSuccessfullMessage(''),3000); 
      
      setFormData({
        option: '',
        Id: '',
        Password: '',
        Mail_Id: '',
        Education: '',
      }); 
    } catch (error) {
      setErrorMessage('User with this ID or password exists. Please try another criterion.');

      setTimeout(() => setErrorMessage(''),3000); 
    }
  };

  return (
    <>
      {errorMessage && (
      <div style={styles.errorMessage}>
        {errorMessage}
      </div>
    )}
    {successfulMessage && (<div style={styles.successfulMessage}>{successfulMessage}</div>)}
    <div style={styles.container}>
      <div style={styles.heading}>
        <h3 style={styles.headingText}>Add Another Person</h3>
      </div>
      <form id="add_another_form" onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="option" style={styles.label}>Select Role:</label>
          <select
            id="option"
            name="option"
            value={formData.option}
            onChange={handleChange}
            required
            style={styles.input}
          >
            <option value="">Select whom you want to add</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="Id" style={styles.label}>ID:</label>
          <input
            type="text"
            id="Id"
            name="Id"
            value={formData.Id}
            onChange={handleChange}
            placeholder="Enter ID"
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="Password" style={styles.label}>Password:</label>
          <input
            type="password"
            id="Password"
            name="Password"
            value={formData.Password}
            onChange={handleChange}
            placeholder="Enter Password"
            required
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label htmlFor="Mail_Id" style={styles.label}>Mail ID:</label>
          <input
            type="email"
            id="Mail_Id"
            name="Mail_Id"
            value={formData.Mail_Id}
            onChange={handleChange}
            placeholder="Enter Email"
            required
            style={styles.input}
          />
        </div>

        {formData.option === 'student' && (
          <div style={styles.formGroup}>
            <label htmlFor="Education" style={styles.label}>Education:</label>
            <input
              type="text"
              id="Education"
              name="Education"
              value={formData.Education}
              onChange={handleChange}
              placeholder="Enter Education"
              required
              style={styles.input}
            />
          </div>
        )}

        <div style={styles.formGroup}>
          <button type="submit" style={styles.button}>Submit</button>
        </div>
        <div style={styles.formGroup}>
          <button type="button" onClick={handleBackToHome} style={styles.button}>
            Back to Home
          </button>
        </div>
      </form>
    </div>
    </>
  );
}

export default Add_Another;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    padding: '40px',
  },
  heading: {
    width: '80%',
    maxWidth: '700px',
    textAlign: 'center',
    backgroundColor: 'rgb(140, 139, 203)',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
  },
  headingText: {
    margin: 0,
    color: 'white',
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  form: {
    width: '100%',
    maxWidth: '600px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '1rem',
  },
  button: {
    
    width: '100%',
    padding: '15px',
    backgroundColor: 'rgb(62, 164, 10)',
    color: 'white',
    fontWeight: 'bold',
    borderRadius: '6px',
    fontSize:'15px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: 'rgba(100,100,100,1)',
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
