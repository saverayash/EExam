import React, { useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "auto",
    display: "flex",
    gap: "20px",
  },
  formGroup: { marginBottom: "20px" },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "8px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    padding: "8px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    minHeight: "80px",
  },
  sidebar: {
    width: "25%",
    background: "#f4f4f4",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    height: "800px",
    overflowY: "auto",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "4px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
    marginTop: "10px",
  },
  questionButton: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
  },
  HomeButton: {
    width: "60px",
    height: "40px",
    borderRadius:'10px',
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    backgroundColor:'rgb(53, 176, 19)'
  },
  questionList: { listStyle: "none", padding: "0", margin: "0" },
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

function AddExamPaper() {
  const [title, setTitle] = useState("");
  const [totalMarks, setTotalMarks] = useState("");
  const [instructions, setInstructions] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [duration, setDuration] = useState("");
  const [step, setStep] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
      const [errorMessage, setErrorMessage] = useState('');
      const [successfulMessage,setSuccessfullMessage]=useState('');
   const navigate=useNavigate();
  const handleNext = () => {
    if (step <= questions.length) {
      setStep((prev) => prev + 1);
      setCurrentQuestion(step === questions.length ? null : questions[step]);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
      setCurrentQuestion(step === 1 ? null : questions[step - 2]);
    }
  };

  const handleSaveQuestion = () => {
    if (currentQuestion) {
    
      if (
        currentQuestion.questionType === "integer" &&
        (!Array.isArray(currentQuestion.range) ||
          currentQuestion.range.length !== 2 ||
          isNaN(currentQuestion.range[0]) ||
          isNaN(currentQuestion.range[1]) ||
          currentQuestion.range[0] > currentQuestion.range[1])
      ) {
        setErrorMessage("Range must contain two valid numbers, and the minimum must be less than the maximum.")
          setTimeout(() => setErrorMessage(''),3000); 
      
        return;
      }
  
      // Save or update question
      const updatedQuestions = [...questions];
      if (step - 1 < questions.length) {
        // Update existing question
        updatedQuestions[step - 1] = currentQuestion;
      } else {
        // Add new question
        updatedQuestions.push(currentQuestion);
      }
      setQuestions(updatedQuestions);
    }
  };
  
  

  const handleSubmit = async () => {
    // console.log(questions);
    questions.forEach(question => {
      if (question.questionType !== 'integer') {
          question.range = null;  // Set range to null for non-integer questions
      }
      if (question.questionType === 'integer') {
          question.correctAnswer = null;  // Ensure correctAnswer is null for integer type
      }
      if (question.questionType === 'choice' && !question.isSCQ) {
          if (Array.isArray(question.correctAnswer)) {
              // Filter out empty answers from the correctAnswer array
              question.correctAnswer = question.correctAnswer.filter(answer => answer.trim() !== "");
          }
      }
  });
  
    const examData = {
      title,
      totalMarks,
      instructions,
      startTime,
      endTime,
      duration,
      questions,
    };

    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) 
        {
          setErrorMessage("Authorization required.")
          setTimeout(() => setErrorMessage(''),3000); 
        }
      const decoded = jwtDecode(token);
      const Mail_Id = decoded.Mail_Id;
      const role=localStorage.getItem("role");
      const response = await axios.post("http://localhost:3000/add_exam_paper", {
        examData,
        Mail_Id,
        role,
      });
      
      setSuccessfullMessage("Exam Submitted Successfully");
          setTimeout(() => setSuccessfullMessage(''),3000); 
      setTitle("");
      setTotalMarks("");
      setInstructions("");
      setStartTime("");
      setEndTime("");
      setDuration("");
      setQuestions([]);
      setStep(0);
    } catch (error) {
      
      setErrorMessage("Error submitting exam:");
      setTimeout(() => setErrorMessage(''),3000); 
    }
  };
  const [showConfirm, setShowConfirm] = useState(false);

  const handleHome = () => {
    setShowConfirm(true);
  };
  
  const confirmLeave = () => {
    navigate('/instructor');
  };
  
  const cancelLeave = () => {
    setShowConfirm(false);
  };

  const handleRangeChange = (index, value) => {
    setCurrentQuestion((prev) => {
      const newRange = prev.range ? [...prev.range] : [0, 0]; 
      newRange[index] = Number(value);
      console.log(newRange);
      return { ...prev, range: newRange }; // Return the new state
    });
   
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
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h3>Exam Details</h3>
        <button
      style={{ ...styles.sidebarButton }}
      onClick={() => setStep(0)} // Step 0 opens the "Exam Details" page
    >
      Edit Exam Details
    </button>
        <h3>Questions</h3>
        <ul style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {questions.map((_, index) => (
            <li key={index}>
              <button
                style={{
                  ...styles.questionButton,
                  backgroundColor: step - 1 === index ? "#4CAF50" : "#f1f1f1",
                }}
                onClick={() => {
                  setStep(index + 1);
                  setCurrentQuestion(questions[index]);
                }}
              >
                {index + 1}
              </button>
            </li>
          ))}
          <li>
            <button
              style={{
                ...styles.questionButton,
                backgroundColor: step === questions.length + 1 ? "#4CAF50" : "#f1f1f1",
              }}
              onClick={() => {
                setStep(questions.length + 1);
                setCurrentQuestion({
                  questionType: "",
                  questionText: "",
                  questionMarks: "",
                  correctAnswer: [""],
                  range:[0,0],
                  options: [""],
                  negativeMarking: false,
                  negativePercentage:0,
                  isSCQ:false,
                  
                });
              }}
            >
              +
            </button>
          </li>
        </ul>
        <button style={{ ...styles.HomeButton}} onClick={handleHome}>
        Home
      </button>
      {showConfirm && (
      <div style={{
        position: "fixed", top: 0, left: 0, width: "100%", height: "100%", 
        backgroundColor: "rgba(0, 0, 0, 0.5)", display: "flex", 
        alignItems: "center", justifyContent: "center"
      }}>
        <div style={{
          backgroundColor: "white", padding: "20px", borderRadius: "8px", 
          textAlign: "center", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)"
        }}>
          <p>Are you sure you want to leave without submitting this paper?</p>
          <button 
            style={{ backgroundColor: "green", color: "white", padding: "10px 20px", borderRadius: "5px", margin: "10px", border: "none", cursor: "pointer" }}
            onClick={confirmLeave}
          >
            OK
          </button>
          <button 
            style={{ backgroundColor: "red", color: "white", padding: "10px 20px", borderRadius: "5px", margin: "10px", border: "none", cursor: "pointer" }}
            onClick={cancelLeave}
          >
            Cancel
          </button>
        </div>
      </div>
    )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1 }}>
        {step === 0 && (
          <div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Total Marks:</label>
              <input
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Instructions:</label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                style={styles.textarea}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Start Time:</label>
              <input
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>End Time:</label>
              <input
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Duration (minutes):</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                style={styles.input}
              />
            </div>

            <button style={styles.button} onClick={handleNext}>
              Next
            </button>
          </div>
        )}

        {step > 0 && step <= questions.length + 1 && (
          <div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Question Type:</label>
              <select
                value={currentQuestion?.questionType || ""}
                onChange={(e) =>
                  setCurrentQuestion((prev) => ({
                    ...prev,
                    questionType: e.target.value,
                  }))
                }
                style={styles.input}
              >
                <option value="" disabled>
                  Select question type
                </option>
                <option value="text">Text</option>
                <option value="integer">Integer</option>
                <option value="choice">Choice</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Question Text:</label>
              <input
                type="text"
                value={currentQuestion?.questionText || ""}
                onChange={(e) =>
                  setCurrentQuestion((prev) => ({
                    ...prev,
                    questionText: e.target.value,
                  }))
                }
                style={styles.input}
              />
            </div>

            {currentQuestion?.questionType==='text' && (
              <div>
                <label style={styles.label}>Correct Answer:</label>
              <input
                type="text"
                value={currentQuestion?.correctAnswer || ""}
                onChange={(e) =>
                  setCurrentQuestion((prev) => ({
                    ...prev,
                    correctAnswer: e.target.value,
                  }))
                }
                style={styles.input}
              />
                </div>

            )}
  {currentQuestion?.questionType === "integer" && (
  <div>
    <label style={styles.label}>Range:</label>
    <div style={{ display: "flex", gap: "10px" }}>
    <input
  type="number"
  value={currentQuestion.range?.[0] || ""}
  onChange={(e) => handleRangeChange(0, e.target.value)}
/>
<input
  type="number"
  value={currentQuestion.range?.[1] || ""}
  onChange={(e) => handleRangeChange(1, e.target.value)}
/>

    </div>
  </div>
)}



            {currentQuestion?.questionType==='choice' && (
            <div style={{ marginBottom: "20px" }}>
    <label style={styles.label}>Question Type:</label>
    <select
      value={currentQuestion?.isSCQ ? "SCQ" : "MCQ"}
      onChange={(e) =>
        setCurrentQuestion((prev) => ({
          ...prev,
          isSCQ: e.target.value === "SCQ", // Set isSCQ based on selection
        }))
      }
      style={styles.input}
    >
      <option value="SCQ">Single Correct Question (SCQ)</option>
      <option value="MCQ">Multiple Correct Question (MCQ)</option>
    </select>
  </div>)}
  {currentQuestion?.questionType === "choice" && (
  <div>
    <label style={styles.label}>Options:</label>
    {Array.isArray(currentQuestion?.options) &&
      currentQuestion.options.map((option, index) => (
        <div
          key={index}
          style={{ marginBottom: "10px", display: "flex", alignItems: "center" }}
        >
          <input
            type="text"
            value={option}
            onChange={(e) =>
              setCurrentQuestion((prev) => {
                if (prev) {
                  const updatedOptions = [...prev.options];
                  updatedOptions[index] = e.target.value;
                  return { ...prev, options: updatedOptions };
                }
                return prev;
              })
            }
            style={{
              ...styles.input,
              width: "calc(100% - 100px)",
              marginRight: "10px",
            }}
          />
          <input
            type={currentQuestion?.isSCQ ? "radio" : "checkbox"}
            name="correctAnswer"
            checked={currentQuestion?.correctAnswer?.includes(option) || false}
            onChange={(e) => {
              setCurrentQuestion((prev) => {
                if (prev) {
                  let updatedCorrectAnswer;
                  if (option.trim() === "") return prev; // Prevent selecting empty options

                  if (prev.isSCQ) {
                    updatedCorrectAnswer = [option];
                  } else {
                    updatedCorrectAnswer = e.target.checked
                      ? [...(prev.correctAnswer || []), option]
                      : prev.correctAnswer.filter((opt) => opt !== option);
                  }
                  return { ...prev, correctAnswer: updatedCorrectAnswer };
                }
                return prev;
              });
            }}
            style={{ marginRight: "10px" }}
          />

          <button
            onClick={() =>
              setCurrentQuestion((prev) => {
                if (prev) {
                  const optionToRemove = prev.options[index];
                  return {
                    ...prev,
                    options: prev.options.filter((_, i) => i !== index),
                    correctAnswer: (prev.correctAnswer || []).filter(
                      (opt) => opt !== optionToRemove && opt.trim() !== ""
                    ),
                  };
                }
                return prev;
              })
            }
            style={{
              ...styles.button,
              backgroundColor: "red",
              padding: "5px 10px",
            }}
          >
            X
          </button>
        </div>
      ))}

    {/* Ensure options array exists before adding new elements */}
    <button
      onClick={() =>
        setCurrentQuestion((prev) => {
          if (prev) {
            return {
              ...prev,
              options: [...(prev.options ?? []), `Option ${prev.options?.length + 1 || 1}`], // Ensure options is an array
            };
          }
          return prev;
        })
      }
    >
      Add Option
    </button>
  </div>
)}


             <div style={styles.formGroup}>
              <label style={styles.label}>Marks:</label>
              <input
                type="number"
                value={currentQuestion?.questionMarks || ""}
                onChange={(e) =>
                  setCurrentQuestion((prev) => ({
                    ...prev,
                    questionMarks: e.target.value,
                  }))
                }
                style={styles.input}
              />
            </div>
            <div style={{ ...styles.formGroup, display: "flex", alignItems: "flex-start", gap: "8px" }}>
  <input
    type="checkbox"
    checked={currentQuestion?.negativeMarking || false}
    onChange={(e) =>
      setCurrentQuestion((prev) => ({
        ...prev,
        negativeMarking: e.target.checked,
      }))
    }
    style={{ ...styles.input, marginTop: "4px" }}
  />
  <label style={styles.label}>Negative Marking:</label>
</div>
{currentQuestion?.negativeMarking && (
  <div style={styles.formGroup}>
    <label style={styles.label}>Negative Percentage:</label>
    <input
      type="number"
      value={currentQuestion?.negativePercentage || ""}
      onChange={(e) =>
        setCurrentQuestion((prev) => ({
          ...prev,
          negativePercentage: e.target.value,
        }))
      }
      style={styles.input}
      placeholder="Enter percentage"
    />
  </div>
)}




            <div style={{ marginTop: "20px" }}>
              <button style={styles.button} onClick={handleSaveQuestion}>
                Save Question
              </button>
              {step > 1 && (
                <button
                  style={{ ...styles.button, marginLeft: "10px", backgroundColor: "#007BFF" }}
                  onClick={handlePrevious}
                >
                  Previous
                </button>
              )}
              <button
                style={{
                  ...styles.button,
                  marginLeft: "10px",
                  backgroundColor: "orange",
                }}
                onClick={handleNext}
              >
                Next
              </button>
              {step==questions.length && (
              <button
              style={{
                  ...styles.button,
                  marginLeft: "10px",
                  backgroundColor: "rgb(75, 189, 40)",
                }}
                onClick={handleSubmit}>
                  Submit
              </button>)}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default AddExamPaper;
