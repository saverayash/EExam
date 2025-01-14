const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Instructor } = require('./login');  
const { Doubt } = require('./Ask_Doubt'); // Assuming Doubt model is imported

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/', async (req, res) => {
    const { doubtId, answer, Mail_Id } = req.body;  // Fixed destructuring

    try {
        // Find the instructor by email
        const instructor = await Instructor.findOne({ Mail_Id: Mail_Id });
        if (!instructor) {
            return res.status(404).send('Instructor not found');
        }

        // Find and update the doubt with the provided answer
        const updatedDoubt = await Doubt.findByIdAndUpdate(
            doubtId,
            { Answer: answer, Instructor_Id: instructor._id },
            { new: true } // Return updated document
        );

        if (!updatedDoubt) {
            return res.status(404).send('Doubt not found');
        }

        // Add the doubt ID to the instructor's Doubts array
        instructor.Doubts.push(doubtId);
        await instructor.save();

        return res.status(201).send('Doubt answered successfully');
    } catch (error) {
        console.error('Error during doubt update:', error);
        return res.status(500).send('An error occurred during doubt update');
    }
});

module.exports = router;
