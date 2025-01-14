import React, { useState } from 'react';
import axios from 'axios'; // Import axios

function Add_Another() {
  const [option, setOption] = useState('');
  const [Id, setId] = useState('');
  const [Password, setPassword] = useState('');
  const [Mail_Id, setMailId] = useState('');
  const [Education, setEducation] = useState('');

  const handler = async (e) => {
    e.preventDefault();
    
    const data = {
      option,
      Id,
      Password,
      Mail_Id,
      ...(option === 'student' && { Education }) // Add Education field only if option is student
    };

    try {
      const response = await axios.post('http://localhost:3000/add', data);
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error adding person:', error);
    }
  };

  return (
    <>
      <h3>Add Another Person</h3>
      <form id="add_anotherform" onSubmit={handler}>
        <select value={option} onChange={(e) => setOption(e.target.value)} required>
          <option value="">Select whom you want to add</option>
          <option value="student">Student</option>
          <option value="instructor">Instructor</option>
        </select>

        {/* Common fields for both Student and Instructor */}
        <div>
          <label>ID:</label>
          <input
            type="text"
            value={Id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Mail ID:</label>
          <input
            type="email"
            value={Mail_Id}
            onChange={(e) => setMailId(e.target.value)}
            required
          />
        </div>

        {/* Conditional fields based on the selected option */}
        {option === 'student' && (
          <div>
            <label>Education:</label>
            <input
              type="text"
              value={Education}
              onChange={(e) => setEducation(e.target.value)}
              required
            />
          </div>
        )}

        <input type="submit" value="Submit" />
      </form>
    </>
  );
}

export default Add_Another;
