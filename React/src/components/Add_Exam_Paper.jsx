import React, { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
function Add_Exam_Paper() {
  const [title, setTitle] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [instructions, setInstructions] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [duration, setDuration] = useState('');
  const [questions, setQuestions] = useState([]);
  const [questionType, setQuestionType] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [marks, setMarks] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [rangeMin, setRangeMin] = useState('');
  const [rangeMax, setRangeMax] = useState('');
  const [options, setOptions] = useState(['']);
  const [isSCQ, setIsSCQ] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [negativeMarking, setNegativeMarking] = useState(false);
  const [negativePercentage, setNegativePercentage] = useState('');

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = options.map((opt, i) => (i === index ? value : opt));
    setOptions(updatedOptions);
  };

  const handleAddQuestion = () => {
    if (!questionText || !marks) {
      alert('Please fill out all required fields.');
      return;
    }

    const newQuestion = {
      questionType,
      questionText,
      questionMarks: parseInt(marks),
      correctAnswer: questionType === 'choice' ? selectedAnswers : correctAnswer,
      range: questionType === 'integer' ? [parseFloat(rangeMin), parseFloat(rangeMax)] : null,
      options: questionType === 'choice' ? options : null,
      isSCQ: questionType === 'choice' ? isSCQ : null,
      negativeMarking,
      negativePercentage: negativeMarking ? parseFloat(negativePercentage) : null,
    };

    setQuestions([...questions, newQuestion]);
    resetQuestionFields();
  };

  const resetQuestionFields = () => {
    setQuestionType('');
    setQuestionText('');
    setMarks('');
    setCorrectAnswer('');
    setRangeMin('');
    setRangeMax('');
    setOptions(['']);
    setIsSCQ(true);
    setSelectedAnswers([]);
    setNegativeMarking(false);
    setNegativePercentage('');
  };

  const handleSubmit = async () => {
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
      const token = localStorage.getItem('jwtToken');
      if(token)
      {
        const decoded = jwtDecode(token);
        const Mail_Id = decoded.Mail_Id; 
        const response = await axios.post('http://localhost:3000/add_exam_paper', {
          examData: examData, 
          Mail_Id: Mail_Id
      });
      
      console.log('Exam submitted successfully:', response.data);
      setTitle('');
      setTotalMarks('');
      setInstructions('');
      setStartTime('');
      setEndTime('');
      setDuration('');
      setQuestions([]);
      }
      else
      console.error('Autherization required');
    } catch (error) {
      console.error('Error submitting exam:', error);
    }
  };

  const handleAnswerSelection = (answer) => {
    if (isSCQ) {
      setSelectedAnswers([answer]);
    } else {
      setSelectedAnswers((prevAnswers) =>
        prevAnswers.includes(answer)
          ? prevAnswers.filter((ans) => ans !== answer)
          : [...prevAnswers, answer]
      );
    }
  };



  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f9f9f9',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    form: {
      width: '100%',
      maxWidth: '800px',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
    },
    formGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
    },
    input: {
      width: '100%',
      padding: '10px',
      fontSize: '14px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      marginBottom: '10px',
    },
    textarea: {
      width: '100%',
      padding: '10px',
      fontSize: '14px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      minHeight: '100px',
      marginBottom: '10px',
    },
    select: {
      width: '100%',
      padding: '10px',
      fontSize: '14px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      marginBottom: '10px',
    },
    button: {
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: 'bold',
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      margin: '10px 0',
    },
    buttonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
    questionContainer: {
      marginTop: '20px',
      width: '100%',
      maxWidth: '800px',
    },
    questionCard: {
      padding: '10px',
      marginBottom: '15px',
      border: '1px solid #ccc',
      borderRadius: '5px',
      backgroundColor: '#fafafa',
    },
    questionText: {
      fontSize: '16px',
      fontWeight: 'bold',
    },
    optionList: {
      listStyleType: 'none',
      padding: '0',
    },
    option: {
      marginBottom: '5px',
    },
    addedQuestionsHeading: {
      marginTop: '30px',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333',
    },
  };

  return (
    <div style={styles.container}>
      <form style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Total Marks:</label>
          <input
            type="number"
            value={totalMarks}
            onChange={(e) => setTotalMarks(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Instructions:</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            style={styles.textarea}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Start Time:</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>End Time:</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Duration (minutes):</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Question Type:</label>
          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
            style={styles.select}
            required
          >
            <option value="" disabled>Select question type</option>
            <option value="text">Text</option>
            <option value="integer">Integer</option>
            <option value="choice">Choice type</option>
          </select>
        </div>

        {questionType && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Question Text:</label>
            <input
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              style={styles.input}
              required
            />
          </div>
        )}

        <div style={styles.formGroup}>
          <label style={styles.label}>Marks:</label>
          <input
            type="number"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        {/* Conditional Inputs for Question Type */}
        {questionType === 'text' && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Correct Answer:</label>
            <input
              type="text"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              style={styles.input}
              required
            />
          </div>
        )}

        {questionType === 'choice' && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Options:</label>
            {options.map((option, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  style={styles.input}
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddOption}
              style={styles.button}
            >
              Add Option
            </button>

            <div>
              <label>
                <input
                  type="checkbox"
                  checked={isSCQ}
                  onChange={() => setIsSCQ(!isSCQ)}
                />
                Single Choice Question (SCQ)
              </label>
            </div>

            <div>
              <label style={styles.label}>Correct Answer(s):</label>
              {options.map((option, index) => (
                <div key={index} style={styles.option}>
                  <label>
                    <input
                      type={isSCQ ? 'radio' : 'checkbox'}
                      checked={selectedAnswers.includes(option)}
                      onChange={() => handleAnswerSelection(option)}
                    />
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {questionType === 'integer' && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Range:</label>
            <input
              type="number"
              placeholder="Min"
              value={rangeMin}
              onChange={(e) => setRangeMin(e.target.value)}
              style={styles.input}
            />
            <input
              type="number"
              placeholder="Max"
              value={rangeMax}
              onChange={(e) => setRangeMax(e.target.value)}
              style={styles.input}
            />
          </div>
        )}

        <div style={styles.formGroup}>
          <label>
            <input
              type="checkbox"
              checked={negativeMarking}
              onChange={() => setNegativeMarking(!negativeMarking)}
            />
            Negative Marking
          </label>
          {negativeMarking && (
            <input
              type="number"
              placeholder="Negative Marking %"
              value={negativePercentage}
              onChange={(e) => setNegativePercentage(e.target.value)}
              style={styles.input}
            />
          )}
        </div>

        <button
          type="button"
          onClick={handleAddQuestion}
          style={styles.button}
        >
          Add Question
        </button>
      </form>

      <button
        type="button"
        onClick={handleSubmit}
        style={styles.button}
        disabled={!title || !questions.length}
      >
        Submit Exam Paper
      </button>

      {/* Display Added Questions */}
      <div style={styles.questionContainer}>
        <h3 style={styles.addedQuestionsHeading}>Added Questions:</h3>
        {questions.length > 0 ? (
          questions.map((q, index) => (
            <div key={index} style={styles.questionCard}>
              <p style={styles.questionText}>
                <strong>Question {index + 1}:</strong> {q.questionText}
              </p>
              <p>Type: {q.questionType}</p>
              <p>Marks: {q.questionMarks}</p>
              {q.questionType === 'choice' && (
                <div>
                  <p>Options:</p>
                  <ul style={styles.optionList}>
                    {q.options.map((opt, i) => (
                      <li key={i}>{opt}</li>
                    ))}
                  </ul>
                  <p>Correct Answer(s): {q.correctAnswer.join(', ')}</p>
                  <p>Single Choice: {q.isSCQ ? 'Yes' : 'No'}</p>
                </div>
              )}
              {q.questionType === 'integer' && (
                <p>Range: {q.range[0]} - {q.range[1]}</p>
              )}
              {q.negativeMarking && (
                <p>Negative Marking: {q.negativePercentage}%</p>
              )}
            </div>
          ))
        ) : (
          <p>No questions added yet.</p>
        )}
      </div>
    </div>
  );
}

export default Add_Exam_Paper;
