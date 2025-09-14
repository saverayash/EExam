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
const {Instructor}=require('./login');
const {Admin}=require('./login');
// Fetch all exams with active end time
router.post('/', async (req, res) => {
    try {
        const currenttime = new Date();
        const { mail_id ,role} = req.body;  // Assuming student_id is passed in the request body
        
        if(role=='Student')
        {
            const student = await Student.findOne({ Mail_Id: mail_id });
const student_id = student ? student._id : null; 
const exams = await Answer_Sheet.find({
    $or:[{ End_Time: { $lte: currenttime }},
     {"Responses.Student_id": student_id}, ] 
 });
 res.json(exams);
        }
    else if(role=='Instructor')
    {
          
          const inst=await Instructor.findOne({Mail_Id:mail_id});
          if(inst!=null)
          {
            const exams = await Answer_Sheet.find({
                $or: [
                    { End_Time: { $lte: currenttime } }, 
                    { _id: { $in: inst.Exam_Set } }     
                ]
            });
            res.json(exams);
          }
          else
          console.error('invalid autherization');
    }
    else
    {
        const adm=await Admin.findOne({Mail_Id:mail_id});
          if(adm!=null)
          {
            const exams = await Answer_Sheet.find(
                    { End_Time: { $lte: currenttime }
            });
            res.json(exams);
          }
          else
          console.error('invalid autherization');
    }
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

    try {
        const exam = await Answer_Sheet.findById(id);  // Use findById to return an object
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


