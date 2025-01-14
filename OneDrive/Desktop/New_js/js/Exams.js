const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const router = express.Router();

// Middleware
app.use(cors());
app.use(express.json());

// Import Answer_Sheet model
const { Answer_Sheet } = require('./Add_Exam_Paper');
const {Student}=require('./login');
// Fetch all exams with active end time
router.post('/', async (req, res) => {
    try {
        const currenttime = new Date();
        const { mail_id } = req.body;  // Assuming student_id is passed in the request body
        
      // Assuming you are inside an async function
const student = await Student.findOne({ Mail_Id: mail_id });
const student_id = student ? student._id : null;  // Handle if student is not found

        console.log(mail_id+" "+student_id);
        // Find exams where the end time is greater than or equal to the current time
        // and there is no response for the given student_id
        const exams = await Answer_Sheet.find({
            End_Time: { $gte: currenttime },
            "Responses.Student_id": { $ne: student_id },  // Ensures student hasn't already submitted a response
        });
       console.log(exams);
        res.json(exams);
    } catch (error) {
        console.error('Error fetching exams:', error);
        res.status(500).json({ message: 'Failed to fetch exams', error: error.message });
    }
});

// Fetch specific exam by ID
router.post('/:id', async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid exam ID' });
    }
console.log(id);;
    try {
        const exam = await Answer_Sheet.findById(id);  // Use findById to return an object
        console.log(exam);
        if (exam) {
           
            res.json(exam);
        } else {
            res.status(404).json({ message: 'Exam not found' });
        }
    } catch (error) {
        console.error('Error fetching exam:', error);
        res.status(500).json({ message: 'Failed to fetch exam', error: error.message });
    }
});

module.exports = router;


