const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');  
const app = express();
const router = express.Router();
const SECRET_KEY = "I_AM_learning_JWT";

app.use(cors());
app.use(express.json());

const { Answer_Sheet } = require('./Add_Exam_Paper');
const { Student } = require('./login');
//const { default: Exams } = require('./React/src/components/Exams');

router.post('/', async (req, res) => {
    try {
        const { examId, responses } = req.body;
        const authHeader = req.headers.authorization;

       
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization token is missing' });
        }

        const token = authHeader.split(" ")[1]; // Extract token part
        let decoded;

        // Verify JWT token and handle errors
        try {
            decoded = jwt.verify(token, SECRET_KEY);
        } catch (jwtError) {
            console.error('JWT Verification Failed:', jwtError);
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        // Find student based on the decoded email
        const student = await Student.findOne({ Mail_Id: decoded.Mail_Id });
        if (!student) {
            console.warn(`Student not found for email: ${decoded.Mail_Id}`);
            return res.status(404).json({ message: 'Student not found' });
        }

        // Transform responses for storage
        const transformedResponses = Object.entries(responses).map(([questionId, answer]) => ({
            questionId,
            answer,
        }));

        // Update Answer_Sheet by adding student responses
        console.log(examId);
        const updatedAnswerSheet = await Answer_Sheet.findOneAndUpdate(
            { _id: examId },
            {
                $push: {
                    Responses: {
                        Student_id: student._id.toString(),
                        Answers: transformedResponses,
                    },
                },
            },
            { new: true }
        );
        const updateExam = await Student.findOneAndUpdate(
            { Mail_Id: decoded.Mail_Id },
            {
                $push: {
                    Exams_Given: examId,  
                },
            },
            { new: true }
        );
        
        if (!updatedAnswerSheet || !updateExam) {
            console.warn(`Answer sheet not found for examId: ${examId}`);
            return res.status(404).json({ message: 'Answer sheet not found' });
        }
         
        res.status(200).json({ message: 'Response saved successfully', answerSheet: updatedAnswerSheet });
    } catch (error) {
        console.error('Error in submitting exam:', error);
        res.status(500).json({ message: 'Failed to submit exam', error: error.message });
    }
});

module.exports = router;
