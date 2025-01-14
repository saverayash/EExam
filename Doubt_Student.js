const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

const { Student } = require('./login');
const { Doubt } = require('./Ask_Doubt');

router.post('/', async (req, res) => {
    const { Mail_Id } = req.body;  // Get Mail_Id from request body
    
    try {
        const student = await Student.findOne({ Mail_Id: Mail_Id });
        
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }
        
        const doubtIds = student.Doubts;  // This is an array of Doubt IDs
        
        // Query the doubts based on the IDs in the student's Doubts array
        const doubts = await Doubt.find({ '_id': { $in: doubtIds } });

        console.log(doubts);
        res.json(doubts);
    } catch (error) {
        console.error('Error fetching doubts:', error);
        res.status(500).json({ message: 'An error occurred while fetching doubts.' });
    }
});

module.exports = router;
