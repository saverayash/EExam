import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import Instructor from './Instructor';

function See_Exam() {
    const { id } = useParams();
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [responses, setResponses] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [marks, setMarks] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
        const [successfulMessage,setSuccessfullMessage]=useState('');
    const navigate=useNavigate();
   

    useEffect(() => {
        const fetchExam = async () => {
            try {
                 const token = localStorage.getItem('jwtToken');
                                if (token) {
                                    const decoded = jwtDecode(token);
                                   
                                    const Mail_Id = decoded.Mail_Id;
                                     
                                    const response = await axios.post(`http://localhost:3000/myexam/see/${id}`, {
                                        Mail_Id:Mail_Id});      
                                        const examData = response.data.exam;
            const currentTime = new Date().getTime(); 
            const endTime = new Date(examData.End_Time).getTime(); // Convert End_Time to timestamp

            if (endTime> currentTime) {
                setErrorMessage("Exam is still ongoing, so you cannot view the exam.");
                setTimeout(() => setErrorMessage(""), 3000);
                setLoading(false);
                
                return;
            }  
            
                setExam(response.data.exam); 
              //  console.log(response.data.answers.Answers);
                const answers = null;
                const marks=null;
              //  console.log("answers  :  "+answers);
              
             
              
              setResponses(null);
              setMarks(null);
              
                //console.log("Processed Answer Map:", answerMap);
              //  setAnswers(response.data.ans
              // wers);
                                }
                                
                                    else {
                                        setErrorMessage('Authentication Required');
                                        setTimeout(() => setErrorMessage(''),700); 
                                       
                                        setLoading(false);
                                    }
            } catch (e) {
               
                setErrorMessage('Exam not found or failed to fetch exam');
                setTimeout(() => setErrorMessage(''),700); 
               
            } finally {
                setLoading(false);
            }
        };
        fetchExam();
    }, [id]);

    const handleHome=()=>{
     const role=localStorage.getItem('role')
    if(role=="user")
    {
   
        navigate('/user');
    }
     else if(role=="Instructor")
     {
          navigate('/instructor');
     }
     else
     {
        navigate('/admin');
     }
    }
    const handleResponseChange = (questionId, value) => {
        setResponses((prev) => ({
            ...prev,
            [questionId]: value
        }));
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

    const getMarksColor = (total) => {
      return '#4CAF50';  // Full marks - Green
                             // Default (0 or no marks) - Green
    };

    if (loading) return <h3>Loading...</h3>;
    if (error) return <h3>{error}</h3>;

    const currentQuestion = exam?.Questions[currentQuestionIndex];

    return (
        <>
                 {errorMessage && (
      <div style={styles.errorMessage}>
        {errorMessage}
      </div>
    )}
    {successfulMessage && (<div style={styles.successfulMessage}>{successfulMessage}</div>)}
                <div style={styles.container}>
                    <div style={styles.sidebar}>
                        <div style={styles.grid}>
                            {exam?.Questions.map((_, index) => (
                                <button
                                    key={index}
                                    style={{
                                        ...styles.questionButton,
                                        backgroundColor: currentQuestionIndex === index ? '#4CAF50' : '#f1f1f1'
                                    }}
                                    onClick={() => jumpToQuestion(index)}
                                >
                                    {index + 1}
                                </button>
                            ))}
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
                               

<div style={styles.marksContainer}>
    <h4 style={styles.questionText}>{currentQuestion.questionText}</h4>
    <h4 
      style={{
        ...styles.marksText,
        color: getMarksColor(currentQuestion.questionMarks)
      }}
    >
       Marks: {currentQuestion.questionMarks}
    </h4>
</div>



                                <div style={{ marginBottom: '30px' }}></div>

                                {currentQuestion.questionType === 'text' && (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '10px' }}>
                <strong>Correct Answer:</strong>
            </span>
            <input
                type="text"
                value={currentQuestion.correctAnswer || ''} // Correct answer in the input box
                readOnly
                style={{ marginRight: '10px' }}
            />
        </div>
    </div>
)}

{currentQuestion.questionType === 'integer' &&  (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: '10px' }}>
                <strong>Answer Range:</strong>
            </span>
            <input
                type="number"
                value={currentQuestion?.range[0] || ''} // Start of the range
                readOnly
                style={{ marginRight: '10px' }}
            />
            <span style={{ marginRight: '10px', color: 'rgb(0, 0, 0)' }}>-</span>
            <input
                type="number"
                value={currentQuestion?.range[1] || ''} // End of the range
                readOnly
                style={{ marginRight: '10px' }}
            />
        </div>
    </div>
)}




                               
{currentQuestion.questionType === 'choice' && (
    <div style={styles.mcqContainer}>
        {currentQuestion.options.map((option, i) => {
            const correctAnswers = currentQuestion.correctAnswer || [];
            const selectedAnswers =  [];
            const isCorrect = correctAnswers.includes(option);
            const isSelected = selectedAnswers.includes(option);

            const optionStyle = {
                ...styles.option,
                ...(isSelected && isCorrect ? styles.correctSelected : {}),
                ...(isSelected && !isCorrect ? styles.wrongSelected : {}),
                ...(!isSelected && isCorrect ? styles.correctUnselected : {}),
            };

            return (
                <div key={`${currentQuestion._id}-${i}`} style={optionStyle}>
                    <span>{`${String.fromCharCode(65 + i)}. ${option}`}</span>
                    {isSelected && isCorrect && <div>Your Answer / Correct</div>}
                    {isSelected && !isCorrect && <div>Wrong Answer</div>}
                    {!isSelected && isCorrect && <div>Correct Answer</div>}
                </div>
            );
        })}
    </div>
)}


{/*{currentQuestion.questionType === 'choice' && !currentQuestion.isSCQ && (
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
)}*/}



                                
                                <div style={styles.navigationButtonsContainer}>
                                    <button style={styles.navButton} onClick={handlePrevious} disabled={currentQuestionIndex === 0}>Previous</button>
                                    <button style={styles.navButton} onClick={handleHome} >Back To Home</button>
                                    <button style={styles.navButton} onClick={handleNext} disabled={currentQuestionIndex === exam.Questions.length - 1}>Next</button>
                                   
                                    
                                </div>
                                
                            </>
                        ) : (
                            <p>No question available</p>
                        )}
                    </div>
                </div>
           
        </>
    );
}
const styles = {
    container: { display: 'flex', height: '100vh' },
    sidebar: { width: '20%', background: '#f4f4f4', padding: '10px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' },
    questionContainer: { flex: 1, padding: '20px' },
    questionButton: { padding: '10px', cursor: 'pointer' },
    popupOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    popupInner: { backgroundColor: '#fff', padding: '30px', borderRadius: '10px' },
    popupButton: { marginTop: '20px' },
    navigationButtonsContainer: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: '20px',
        padding: '0 20px',
    },
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
        questionText: {
          fontSize: '0.7 rem',
          fontWeight: '300',
          color: '#333',
          marginBottom: '10px',
          wordBreak: 'break-word', 
        whiteSpace: 'normal', 
        maxWidth: '100%', 
        overflowWrap: 'break-word'
        },
        marksText: {
          fontSize: '1.25rem',
          fontWeight: '500',
          color: '#4CAF50',
        },
        marksContainer: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 15px',
          //border: '1px solid #ddd',
          borderRadius: '8px',
          marginBottom: '15px',
         // backgroundColor: '#f9f9f9',
         // boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
      
    Submit: {
        display: 'block', 
        marginTop: '40px',
        marginLeft: 'auto', 
        marginRight: '0px', 
        padding: '13px 40px',
        fontSize: '18px',
        cursor: 'pointer',
        borderRadius: '10px',
        backgroundColor: 'rgb(75, 230, 51)',
        color: 'white',
        border: 'none',
        width: '150px', 
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
       borderColor: 'rgb(48, 148, 26)',
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
    isselectediscorrectbox: { fontSize: '14px', color: 'black', marginTop: '5px' },
     
      
    isselectedbutwrong: { fontSize: '14px', color: 'geen', marginTop: '5px' },
    notselectedbutcorrect: { fontSize: '14px', color: 'black', marginTop: '5px' },
    correctSelected: { backgroundColor: 'rgb(74, 223, 14)' },
    correctUnselected: { backgroundColor: 'rgb(74, 223, 14)'  },
    wrongSelected: { backgroundColor: 'rgb(222, 43, 43)' },
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

export default See_Exam;
