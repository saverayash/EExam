const express = require('express');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const router1 = express.Router();

// Define Paper Schema
/*const Schema_Paper = new Schema({
    Title: String,
    Total_Marks: Number,
    Instruction: String,
    Start_Time: { type: Date, required: true },
    End_Time: { type: Date, required: true },
    Time: { type: Number, required: true },
    Questions: [
        {
            questionType: String,
            questionText: String,
            questionMarks: Number,
            correctAnswer: [Schema.Types.Mixed],
            range: {
                type: [Number],
                validate: {
                    validator: function (v) {
                        return v == null || v.length === 2;
                    },
                    message: 'Range must be an array with two numbers'
                }
            },
            options: [String],
            isSCQ: Boolean,
            negativeMarking: Boolean,
            negativePercentage: Number
        }
    ]
});*/

// Define Answer_Sheet Schema
const Schema_Answer_Sheet = new Schema({
    Checked:Boolean,
   // Paper_Id: String,
    Title: String,
    Total_Marks: Number,
    Instruction: String,
    Start_Time: { type: Date, required: true },
    End_Time: { type: Date, required: true },
    Time: { type: Number, required: true },
    Questions: [
        {
            questionType: String,
            questionText: String,
            questionMarks: Number,
            correctAnswer: [Schema.Types.Mixed],
            range: {
                type: [Number],
                validate: {
                    validator: function (v) {
                        return v == null || v.length === 2;
                    },
                    message: 'Range must be an array with two numbers'
                }
            },
            options: [String],
            isSCQ: Boolean,
            negativeMarking: Boolean,
            negativePercentage: Number
        }
    ],
    Responses: [
        {
            Student_id: String,
            Answers: [],
            Marks:[],
            Total_Score:Number,
        }
    ]
});

// Define Models
//const Paper = mongoose.model('Paper', Schema_Paper, 'Paper');
const Answer_Sheet = mongoose.model('Answer_Sheet', Schema_Answer_Sheet, 'Answer_Sheet');

// Route to create a new Paper and corresponding Answer_Sheet
router1.post('/', async (req, res) => {
    try {
        const { title, totalMarks, instructions, startTime, endTime, duration, questions } = req.body;

        // Create new Paper document
      /*  const newPaper = new Paper({
            Title: title,
            Total_Marks: totalMarks,
            Instruction: instructions,
            Start_Time: new Date(startTime),
            End_Time: new Date(endTime),
            Time: duration,
            Questions: questions
        });

        // Save Paper to database
        const savedPaper = await newPaper.save();*/

        // Create corresponding Answer_Sheet with Paper_Id referencing the savedPaper's _id
        const newAnswerSheet = new Answer_Sheet({
            Checked:false,
           // Paper_Id: savedPaper._id.toString(),
            Title: title,
            Total_Marks: totalMarks,
            Instruction: instructions,
            Start_Time: new Date(startTime),
            End_Time: new Date(endTime),
            Time: duration,
            Questions: questions,   // Copying questions from Paper
            Responses: [] ,
            Mark :Number,          // Initialize with an empty Responses array
        });

        // Save Answer_Sheet to database
        await newAnswerSheet.save();

        res.status(201).json({ message: 'Exam paper and corresponding answer sheet created successfully!' });
    } catch (error) {
        console.error('Error creating exam paper or answer sheet:', error);
        res.status(500).json({ message: 'Failed to create exam paper and answer sheet', error: error.message });
    }
});

module.exports = {
    router1,
   // Paper,
    Answer_Sheet
};
