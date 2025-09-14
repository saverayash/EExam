const express = require('express');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const router1 = express.Router();

const {Instructor} =require('./login');
const {Admin}=require('./login');
const Schema_Answer_Sheet = new Schema({
    Checked:Boolean,
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
        
        
        const { examData, Mail_Id,role } = req.body;
        console.log(examData+" "+Mail_Id);
        const { title, totalMarks, instructions, startTime, endTime, duration, questions } = examData;
        //const {Mail_Id}=req.body.Mail_Id;

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
        if(role=='Instructor')
            model=Instructor;
        else
        model=Admin;
        const inst=await model.findOne({Mail_Id:Mail_Id});
        // Create corresponding Answer_Sheet with Paper_Id referencing the savedPaper's _id
        const newAnswerSheet = new Answer_Sheet({
            Checked:false,
           
            Title: title,
            Total_Marks: totalMarks,
            Instruction: instructions,
            Start_Time: new Date(startTime),
            End_Time: new Date(endTime),
            Time: duration,
            Questions: questions,   // Copying questions from Paper
            Responses: [] ,
          
        });

        
        await newAnswerSheet.save();
      
      // console.log(inst);
        const updateExamSet = await model.findOneAndUpdate(
            { Mail_Id: Mail_Id }, 
            { 
                $push: { 
                    Exam_Set: newAnswerSheet._id ,
                } ,
            },
            { new: true }
        );
          if(!updateExamSet)
            return res.status(400).json({ message: 'Failed to update the instructor with the new answer sheet.' });
        else
        res.status(201).json({ message: 'Exam paper and corresponding answer sheet created successfully!' });
    } catch (error) {
        console.error('Error creating exam paper or answer sheet:', error);
        res.status(500).json({ message: 'Failed to create exam paper and answer sheet', error: error.message });
    }
});

module.exports = {
    router1,
    Answer_Sheet,
};
