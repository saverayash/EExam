import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Exams from './Exams';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Give_Exam() {
    const { id } = useParams();
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [responses, setResponses] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showPopup, setShowPopup] = useState(true);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [newOption, setNewOption] = useState('');
    const navigate=useNavigate();
    const [timeLeft, setTimeLeft] = useState(null);
    const [Mail_Id,setMail_Id]=useState(null);
    const [UserId,setuserId]=useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
     const [errorMessage, setErrorMessage] = useState('');
        const [successfulMessage,setSuccessfullMessage]=useState('');
        const [showLeaveMessage, setShowLeaveMessage] = useState(false);

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const token=localStorage.getItem('jwtToken');
                if(token)
                {
                    const decoded = jwtDecode(token);
                    const Mail_Id = decoded.Mail_Id; 
                    const UserId=decoded.Id;
                    setMail_Id(Mail_Id);
                    setuserId(UserId);
                    //console.log(Mail_Id);
                   // console.log(decoded.Id);
;                const response = await axios.post(`http://localhost:3000/exams/${id}`);
                setExam(response.data);
              
               initializeTimer(response.data.Time, response.data.End_Time);
                }
                else
                {
                     setErrorMessage('Authentication Required');
                    setTimeout(() => setErrorMessage(''),700); 
                
                    setLoading(false);
                }
            } catch (e) {
                console.log(e);
                setErrorMessage('Exam not found or failed to fetch exam');
                setTimeout(() => setErrorMessage(''),700); 
            } finally {
                setLoading(false);
            }
        };
        fetchExam();
    }, [id]);

    useEffect(() => {
        // Enter Full-Screen Mode
        const enterFullScreen = () => {
            if (!document.fullscreenElement) {
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
                }
            }
        };
    
        // Handle Visibility Change (Tab Switching)
        const handleVisibilityChange = async () => {
            if (document.hidden) {
                await handleSubmit();
            }
        };
    
        // Handle Full-Screen Exit (Auto Submit)
        const checkFullScreen = setInterval(() => {
            if (!document.fullscreenElement) {
                handleSubmit(); // Automatically submit the exam when exiting full-screen
            }
        }, 100);
    
        // Handle Before Unload (Prevent Tab Closing)
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = "You cannot leave! Your exam will be submitted.";
            handleSubmit();
        };
    
        // Block Keyboard Shortcuts
        const handleKeyDown = (event) => {
            if (
                (event.ctrlKey && ["t", "w", "n"].includes(event.key)) || // Ctrl+T, Ctrl+W, Ctrl+N
                (event.altKey && event.key === "Tab") || // Alt+Tab
                event.key === "F11" || // F11 (Fullscreen Exit)
                event.key === "Escape" // Escape Key
            ) {
                event.preventDefault();
                alert("Keyboard shortcuts are disabled during the exam.");
            }
        };
    
        // Disable Right-Click
        const handleContextMenu = (event) => event.preventDefault();
    
        // Apply Event Listeners
        enterFullScreen();
        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("beforeunload", handleBeforeUnload);
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("contextmenu", handleContextMenu);
    
        return () => {
            // Cleanup Event Listeners
            clearInterval(checkFullScreen);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("beforeunload", handleBeforeUnload);
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("contextmenu", handleContextMenu);
        };
    }, []);
    
    const initializeTimer = (duration, endTime) => {
        if (!endTime) {
            setTimeLeft(duration * 60);  // Default to full duration if no end time is specified
            return;
        }
        const now = new Date().getTime();
        const remainingTime = Math.max(0, Math.floor((new Date(endTime).getTime() - now) / 1000));
        setTimeLeft(Math.min(duration * 60, remainingTime));
    };
    
    // Timer Countdown (in seconds)
    
    useEffect(() => {
      //  console.log(timeLeft);
        if (timeLeft == 0)  handleSubmit({ preventDefault: () => {} });
    
        const interval = setInterval(() => {
          setTimeLeft((prev) => prev - 1);
        }, 1000);
    
        return () => clearInterval(interval);
      }, [timeLeft]);
    // Render Timer in hh:mm:ss format
    const formatTime = (seconds) => {
        const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        return `${hours}:${minutes}:${secs}`;
    };

    const handleResponseChange = (questionId, value) => {
        setResponses((prev) => ({ ...prev, [questionId]: value }));
    };

    const handleMCQResponseChange = (questionId, option) => {
        setResponses((prev) => {
            const currentResponses = prev[questionId] || [];
            return {
                ...prev,
                [questionId]: currentResponses.includes(option)
                    ? currentResponses.filter((o) => o !== option)
                    : [...currentResponses, option]
            };
        });
    };

    const handleSubmit = async (e) => {
        //e.preventDefault();
        
        
        try {
            const response = await axios.post('http://localhost:3000/submit_exam', { examId: id, responses }, {
                headers: { 
                    Authorization: 'Bearer ' + localStorage.getItem('jwtToken') 
                }
            });
            setSuccessfullMessage('Responses submitted successfully')
            setTimeout(() => {
                setSuccessfullMessage('');
                navigate('/user');
            }, 2000);
            
        } catch (e) {
            setErrorMessage('Error submitting responses. Please try again later.');
            setTimeout(() => setErrorMessage(''),700); 
         
        }
    };

    const handleAcceptTerms = () => {
        if (acceptTerms) setShowPopup(false);
        else alert('Please accept the terms and conditions.');
    };

    const handleNext = () => {
        if (currentQuestionIndex < exam?.Questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    const jumpToQuestion = (index) => {
        setCurrentQuestionIndex(index);
    };

    

    const handleMouseEnter = (e) => {
        e.target.style.backgroundColor = styles.popupButtonHover.backgroundColor;
    };

    const handleMouseLeave = (e) => {
        e.target.style.backgroundColor = styles.popupButton.backgroundColor;
    };

    const InstructionModal = ({ show, onClose, instruction }) => {
        //console.log("Is Modal Visible: ", show); // Debugging log
        
        if (!show) return null;
    
        return (
            <div style={styles.modalBackground}>
                <div style={styles.modal}>
                    <h3 style={styles.heading}>{exam?.Title}</h3>
                    <p style={styles.paragraph}>Id:{UserId}</p>
                    <p style={styles.paragraph}>Mail Id:{Mail_Id}</p>
                    <p style={styles.paragraph}>Total Marks: {exam?.Total_Marks}</p>
                    <p style={styles.paragraph}>Time Remaining:{Math.floor(timeLeft/60)} Minutes {timeLeft%60} Seconds</p>
                    <p style={styles.paragraph}>Instructions: {exam?.Instruction}</p>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        );
    };
    
    if (loading) return <h3>Loading...</h3>;
    if (error) return <h3>{error}</h3>;
    const handleInstructionClick = () => {
        setIsModalVisible(true);
      };
    
      const handleModalClose = () => {
        setIsModalVisible(false);
      };
    const currentQuestion = exam?.Questions[currentQuestionIndex];

    return (
        <>
             {errorMessage && (
      <div style={styles.errorMessage}>
        {errorMessage}
      </div>
    )}
    {successfulMessage && (<div style={styles.successfulMessage}>{successfulMessage}</div>)}
    {showLeaveMessage && (
                <div style={styles.confirmationBox}>
                    <p>Are you sure you want to leave? Your paper will be submitted automatically.</p>
                    <button onClick={()=>{handleSubmit();setShowLeaveMessage(false)}} style={styles.confirmButton}>Yes, Submit & Leave</button>
                    <button onClick={() => setShowLeaveMessage(false)} style={styles.cancelButton}>Cancel</button>
                </div>
            )}
            {showPopup ?  (
        <div style={styles.popupOverlay}>
            <div style={styles.popupInner}>
                <h3 style={styles.heading}>{exam?.Title}</h3>
                <p style={styles.paragraph}>Id:{UserId}</p>
                 <p style={styles.paragraph}>Mail Id:{Mail_Id}</p>
                <p style={styles.paragraph}>Total Marks: {exam?.Total_Marks}</p>
                <p style={styles.paragraph}>Time Remaining:{Math.floor(timeLeft/60)} Minutes {timeLeft%60} Seconds</p>
                <p style={styles.paragraph}>Instructions: {exam?.Instruction}</p>
                <label style={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={() => setAcceptTerms(!acceptTerms)}
                        style={styles.checkbox}
                    />
                    I accept the terms and conditions
                </label>
                
                <button 
                    style={styles.popupButton} 
                    onClick={handleAcceptTerms}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    disabled={!acceptTerms}
                >
                    Start Exam
                </button>
            </div>
        </div>
    ) : (
                <div style={styles.container}>
                    <div style={styles.sidebar}>
  <div style={styles.grid}>
    {exam?.Questions.map((_, index) => (
      <button
        key={index}
        style={{
          ...styles.questionButton,
          backgroundColor: currentQuestionIndex === index ? '#4CAF50' : '#f1f1f1',
        }}
        onClick={() => jumpToQuestion(index)}
      >
        {index + 1}
      </button>
    ))}
  </div>


                        <div style={styles.Countdown}>
  <strong></strong>{" "}
  <button onClick={handleInstructionClick} style={styles.link}>
    Instructions
  </button>
  <h3>
    Time Remaining: <strong>{formatTime(timeLeft)}</strong>
  </h3>
  <InstructionModal
    show={isModalVisible}
    onClose={handleModalClose}
    instruction={exam?.Instruction}
  />
</div>




                    </div>
                    <div style={styles.questionContainer}>
                        {currentQuestion ? (
                            <>
                                <div style={styles.ExamQuestionNum}>
                                <h2>Question No. {currentQuestionIndex + 1}</h2>
                                
                                {currentQuestion.questionType === 'text' && <h4>Text Answer</h4>}
                                {currentQuestion.questionType === 'integer' && <h4>Integer Answer</h4>}
                                {currentQuestion.questionType === 'choice' && currentQuestion.isSCQ && <h4>Single Correct Choice Question (SCQ)</h4>}
                                {currentQuestion.questionType === 'choice' && !currentQuestion.isSCQ && <h4>Multiple Correct Choice Question (MCQ)</h4>}
                                
                                </div>
                                <br></br>
                                <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
  //  borderBottom: '1px solid #ddd',
    fontFamily: 'Arial, sans-serif'
}}>
    <div style={{ margin: 0, fontWeight: '500',   wordBreak: 'break-word', 
        whiteSpace: 'normal', 
        maxWidth: '100%', 
        overflowWrap: 'break-word',fontSize:'1.2rem'  }}>{currentQuestion.questionText}</div>
    
    <div style={{ textAlign: 'right' }}>
        {!currentQuestion.negativeMarking && (
    <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'rgb(30, 28, 28)' }}>
        Mark: {currentQuestion.questionMarks}
    </h3>)}
    {currentQuestion.negativeMarking && (
        <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'rgb(30, 28, 28)' }}>
            Mark: {currentQuestion.questionMarks} / {-(currentQuestion.negativePercentage * currentQuestion.questionMarks) / 100}
        </h3>
    )}
</div>

</div>
<br></br>
<br></br>
{currentQuestion.questionType === 'text' && (
  <div>
    <label htmlFor={`answer-${currentQuestion._id}`}>Answer : </label>
    <input
      id={`answer-${currentQuestion._id}`}
      type="text"
      value={responses[currentQuestion._id] || ''}
      onChange={(e) => handleResponseChange(currentQuestion._id, e.target.value)}
    />
  </div>
)}

{currentQuestion.questionType === 'integer' && (
  <div>
    <label htmlFor={`answer-${currentQuestion._id}`}>Answer : </label>
    <input
      id={`answer-${currentQuestion._id}`}
      type="number"
      value={responses[currentQuestion._id] || ''}
      onChange={(e) => handleResponseChange(currentQuestion._id, e.target.value)}
    />
  </div>
)}

                            {currentQuestion.questionType === 'choice' && currentQuestion.isSCQ && (
    <div style={styles.scqContainer}>
        {currentQuestion.options.map((option, i) => {
            const isSelected = responses[currentQuestion._id] === option;

            return (
                <div
                    key={i}
                    style={{
                        ...styles.optionWrapper,
                        ...(isSelected ? styles.selectedOption : styles.option)  // Apply selected/unselected style
                    }}
                    onClick={() => handleResponseChange(
                        currentQuestion._id,
                        isSelected ? null : option
                    )}
                >
                    <div style={styles.optionItem}>
                        <span style={styles.optionText}>
                            {String.fromCharCode(65 + i)}. {option}
                        </span>
                    </div>
                </div>
            );
        })}
    </div>
)}


{currentQuestion.questionType === 'choice' && !currentQuestion.isSCQ && (
    <div style={styles.mcqContainer}>
        {currentQuestion.options.map((option, i) => {
            const isSelected = responses[currentQuestion._id]?.includes(option);

            return (
                <div
                    key={`${currentQuestion._id}-${i}`}
                    style={{
                        ...styles.optionWrapper,
                        ...(isSelected ? styles.selectedOption : styles.option),  // Apply selected/unselected style
                    }}
                    onClick={() => handleMCQResponseChange(
                        currentQuestion._id,
                        option
                    )}
                >
                    <div style={styles.optionItem}>
                        <span style={styles.optionText}>
                            {String.fromCharCode(65 + i)}. {option}
                        </span>
                    </div>
                </div>
            );
        })}
    </div>
)}



                                
                                <div style={styles.navigationButtonsContainer}>
                                    <button style={styles.navButton} onClick={handlePrevious} disabled={currentQuestionIndex === 0}>Previous</button>
                                    <button style={styles.navButton} onClick={handleNext} disabled={currentQuestionIndex === exam.Questions.length - 1}>Next</button>
                                </div>
                                
                                {currentQuestionIndex === exam.Questions.length - 1 && (
                                    <button style={styles.Submit} onClick={handleSubmit}>Submit</button>
                                )}
                            </>
                        ) : (
                            <p>No question available</p>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
const styles = {
    padding: '20px',
  backgroundColor: '#f0f0f0',
  border: '1px solid #ddd',
  borderRadius: '8px',
  textAlign: 'center',
  boxSizing: 'border-box',
  transition: 'transform 0.3s ease',
  cursor: 'pointer',
  fontSize: '16px',
  ':hover': {
    backgroundColor: '#ddd', // Change background on hover
  },
    modalBackground: {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(69, 66, 66, 0.7)',
        backdropFilter: 'blur(10px)',  // Apply blur to the background
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '10px',
        textAlign: 'center',
        zIndex: 10,  // Ensure it appears above the blurred background
        maxWidth: '70%', // Restrict width for better appearance
        position: 'relative', // Ensure it stays within the modalBackground
    },
    popupOverlay: {
        width: '100%',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',  // Semi-transparent overlay
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
    },
    link: {
        borderColor:'white',
        fontSize:'1rem',
        cursor: 'pointer', // Ensures the element shows a clickable cursor
        color: 'black', // Gives it a clickable link color
     // Optionally adds underline for links
      },
    popupInner: {
        backgroundColor: '#fff',
        padding: '30px',
        width: '500px',            // Fixed width
        maxHeight: '80vh',         // Maximum height (80% of viewport)
        overflowY: 'auto',         // Vertical scroll if needed
        borderRadius: '12px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        animation: 'fadeIn 0.3s ease-in-out',
    },
    popupButton: {
        marginTop: '20px',
        padding: '12px 24px',
        fontSize: '16px',
        backgroundColor: '#4CAF50',  
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    popupButtonHover: {
        backgroundColor: '#45a049',
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20px',
        fontSize: '14px',
    },
    checkbox: {
        marginRight: '8px',
        transform: 'scale(1.2)',
    },
    heading: {
        marginBottom: '15px',
        fontSize: '24px',
        fontWeight: '600',
        color: '#333',
    },
    paragraph: {
        fontSize: '16px',
        color: '#555',
        marginBottom: '10px',
        whiteSpace: 'normal',
        wordWrap: 'break-word',   // Ensure long words break and wrap properly
    },
    container: { display: 'flex', height: '100vh' },
    sidebar: { width: '20%', background: '#f4f4f4', padding: '10px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' },
    questionContainer: { flex: 1, padding: '20px' },
    questionButton: { padding: '10px', cursor: 'pointer' },
    
    
    navButton: {
        padding: '15px 40px',
        fontSize: '16px',
        cursor: 'pointer',
        borderRadius: '5px',
        backgroundColor: 'rgb(140, 139, 203)',
        color: 'white',
        border: 'none',
        transition: 'background-color 0.3s',
    },
    navButtonDisabled: {
        backgroundColor: 'grey',
        cursor: 'not-allowed',
    },
    ExamQuestionNum:{
        marginTop:'20px',
        padding:'15px',
        backgroundColor:'rgb(140, 139, 203)',
        borderRadius:'0px',
        color:'white',
    } ,
    navigationButtonsContainer: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: '20px',
        padding: '0 20px',
    },
    Submit: {
        display: 'block', // Changed to block to ensure it behaves properly within the container
        marginTop: '40px',
        marginLeft: 'auto', // Ensure it's centered horizontally within the parent
        marginRight: '0px', // Ensures it’s centered horizontally
        padding: '13px 40px',
        fontSize: '18px',
        cursor: 'pointer',
        borderRadius: '10px',
        backgroundColor: 'rgb(75, 230, 51)',
        color: 'white',
        border: 'none',
        width: '150px', // Give it a fixed width
        transition: 'background-color 0.3s',
    },
    scqContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginTop: '15px',
        wordBreak: 'break-word', 
        whiteSpace: 'normal', 
        maxWidth: '100%', 
        overflowWrap: 'break-word' 
    },
    
    mcqContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginTop: '15px',
        wordBreak: 'break-word', // Ensures long words wrap properly
        whiteSpace: 'normal', // Prevents text from staying in one line
        maxWidth: '100%', // Ensures it does not overflow the container
        overflowWrap: 'break-word' // Helps break long words when necessary
    },
    optionWrapper: {
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        padding: '10px',
        border: '1px solid rgba(95, 145, 152, 0)',
        borderRadius: '5px',
       backgroundColor: 'rgba(53, 39, 39, 0.1)',
        transition: 'background-color 0.3s',
    },
  /*  optionWrapper.hover: {
        backgroundColor: '#f0f0f0',
    },*/
    selectedOption: {
        backgroundColor: 'rgb(208, 237, 210)',
       borderColor: 'rgb(38, 78, 40)',
    },
    option:{
        backgroundColor:'rgba(53, 39, 39, 0.1)',
        borderRadius:'5px',
        borderColor: 'rgba(109, 78, 78, 0.24)',
    },
    optionItem: {
        flex: 1,
        marginLeft: '10px',
    },
    optionText: {
        fontSize: '16px',
    },
    radioCheckbox: {
        cursor: 'pointer',
    },
    Countdown:{
        borderColor:'rgb(141, 178, 190)',
        borderRadius:'5px',
        position: 'fixed',
        left: '5px',
        bottom: '20px',
       // color:'white',
      // backgroundColor:'rgb(140, 139, 203)',
       width:'320px',
       textAlign:'center',
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
    confirmationBox: {
        background: "#FFF3CD",
        color: "#856404",
        padding: "15px",
        borderRadius: "8px",
        textAlign: "center",
        width: "80%",
        maxWidth: "400px",
        margin: "20px auto",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
        position: 'fixed',
        right: '600px',
        top: '0px',
    },
    confirmButton: {
        background: "#D9534F",
        color: "white",
        padding: "8px 12px",
        margin: "10px",
        border: "none",
        cursor: "pointer",
        borderRadius: "5px"
    },
    cancelButton: {
        background: "#5BC0DE",
        color: "white",
        padding: "8px 12px",
        margin: "10px",
        border: "none",
        cursor: "pointer",
        borderRadius: "5px"
    }
};

export default Give_Exam;
