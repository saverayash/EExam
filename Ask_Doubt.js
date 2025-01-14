const express = require('express');
const router2 = express.Router();
const mongoose = require('mongoose');
const { Student } = require('./login');  // Fixed duplicate import
const { Schema } = mongoose;


const Doubt_Schema = new Schema({
  Student_Id: { type: String, required: true },
  Instructor_Id: { type: String, required: false },
  Question: { type: String, required: true },
  Answer: { type: String, default: null }
});



const Doubt = mongoose.model('Doubt', Doubt_Schema, 'Doubt');


router2.use(express.json());
router2.use(express.urlencoded({ extended: true }));

router2.post('/', async (req, res) => {
  const { Text, Mail_Id } = req.body; // Fixed destructuring

  try {
    // Find the student by email
    const student = await Student.findOne({ Mail_Id: Mail_Id });
    if (!student) {
      return res.status(404).send('Student not found');
    }

    // Add new doubt to Doubt collection
    const newDoubt = new Doubt({
      Student_Id: student._id,
      Instructor_Id: null,
      Question: Text,
      Answer: null,
    });

    // Save the doubt
    await newDoubt.save();

    // Add the doubt ID to the student's Doubts array
    student.Doubts.push(newDoubt._id);
    await student.save();

    return res.status(201).send('Doubt added successfully');
  } catch (error) {
    console.error('Error during placing doubt:', error);
    return res.status(500).send('An error occurred during placing doubt');
  }
});

module.exports={Doubt,router2}
