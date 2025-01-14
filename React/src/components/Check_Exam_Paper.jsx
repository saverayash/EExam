import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Check_Exam_Paper() {
  const [title, setTitle] = useState("");  // State for title input
  const [examPaper, setExamPaper] = useState(null);  // State to store the exam paper data
  const navigate = useNavigate();  // For navigation after checking the exam paper

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3000/check_exam_paper', { title });
      setExamPaper(response.data);  // Store the exam paper data
    } catch (error) {
      console.error("Error fetching the exam paper:", error);
    }
  };

  return (
    <>
      <h1>Do you want to check the Exam Paper?</h1>
      <div>
        <label>Title: </label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Enter exam title" 
        />
        <button onClick={handleSubmit}>Check Exam Paper</button>
      </div>

      {examPaper && (
        <div>
          <h2>Exam Paper Details</h2>
          {/* Render exam paper details */}
          <pre>{JSON.stringify(examPaper, null, 2)}</pre>
        </div>
      )}
    </>
  );
}

export default Check_Exam_Paper;
