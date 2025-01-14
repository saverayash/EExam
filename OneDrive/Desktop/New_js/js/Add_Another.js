const express = require('express');
const { Student, Instructor } = require('./login'); // Adjust the path as necessary
const router = express.Router();

router.post('/', async (req, res) => {
    const { option, Id, Password, Mail_Id, Education } = req.body;
    try {
        if (option === 'student') {
            // Check if student already exists
            const user = await Student.findOne({
                $or: [
                  { Id: Id },
                  { Mail_Id: Mail_Id }
                ]
            });

            if (user) {
                return res.status(400).send("Student with this Id or Mail already exists");
            }
        //     console.log(Mail_Id);
            // Create new student
            const newStudent = await Student.create({
                Id: Id,
                Password: Password,
                Mail_Id: Mail_Id,
                Education: Education
            });

            return res.status(201).send("Student added successfully.");
        
        } else if (option === 'instructor') {
            // Check if instructor already exists
            const inst = await Instructor.findOne({
                $or: [
                  { Id: Id },
                  { Mail_Id: Mail_Id }
                ]
            });

            if (inst) {
                return res.status(400).send("Instructor with this Id or Mail already exists");
            }

            // Create new instructor
            const newInstructor = await Instructor.create({
                Id: Id,
                Password: Password,
                Mail_Id: Mail_Id,
                Experience: null, // You can customize this as needed
                Exam_Set: [] // Assuming it's an empty array by default
            });

            return res.status(201).send("Instructor added successfully.");
        
        } else {
            return res.status(400).send("Invalid option selected.");
        }
    } catch (error) {
        console.error('Error adding user:', error);
        return res.status(500).send('An error occurred while adding the user.');
    }
});

module.exports = router;
