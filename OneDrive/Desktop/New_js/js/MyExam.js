const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const router = express.Router();


app.use(cors());
app.use(express.json());


const { Answer_Sheet } = require('./Add_Exam_Paper');
const {Student}=require('./login');
// Fetch all exams with active end time
router.post('/', async (req, res) => {
    try {
      
        const { mail_id } = req.body;  
        
      
const student = await Student.findOne({ Mail_Id: mail_id });
const student_id = student ? student._id : null;  // Handle if student is not found

        console.log(mail_id+" "+student_id);

        const examsGiven = student.Exams_Given || [];

        // Find exams the student has taken
        const exams = await Answer_Sheet.find({
            _id: { $in: examsGiven }  // Include exams the student has already taken
        });
        res.json(exams);
    } catch (error) {
        console.error('Error fetching exams:', error);
        res.status(500).json({ message: 'Failed to fetch exams', error: error.message });
    }
});

router.post('/:id', async (req, res) => {
    const { id } = req.params;
    const { Mail_Id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid exam ID' });
    }

    try {
        const exam = await Answer_Sheet.findById(id);  // Get the exam by ID
    
        if (exam) {
            const student = await Student.findOne({ Mail_Id: Mail_Id });
            const student_id = student ? student._id : null;
    
            // Filter the Responses array directly from the fetched exam object
            const studentResponse = exam.Responses.find(
                (response) => response.Student_id.toString() === student_id.toString()
            );
    
            res.json({ exam: exam, answers: studentResponse || null });
        } else {
            res.status(404).json({ message: 'Exam not found' });
        }
    } catch (error) {
        console.error('Error fetching exam:', error);
        res.status(500).json({ message: 'Failed to fetch exam', error: error.message });
    }
    
});
router.post('/see/:id', async (req, res) => {
    const { id } = req.params;
    const { Mail_Id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid exam ID' });
    }

    try {
        const exam = await Answer_Sheet.findById(id);  // Get the exam by ID
    
        if (exam) {
           
    
            res.json({ exam: exam, answers:null });
        } else {
            res.status(404).json({ message: 'Exam not found' });
        }
    } catch (error) {
        console.error('Error fetching exam:', error);
        res.status(500).json({ message: 'Failed to fetch exam', error: error.message });
    }
    
});

module.exports = router;


