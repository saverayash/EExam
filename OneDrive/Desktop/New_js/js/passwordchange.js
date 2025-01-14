const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Instructor, Admin, Student } = require('./login'); // Import models

const secretKey = "I_AM_learning_JWT"; // Your secret key
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/; // Password validation regex

// Change password route
router.post('/', async (req, res) => {
    const { Old_Password, New_Password } = req.body;

    // Log headers for debugging
    console.log('Headers:', req.headers);

    // Retrieve token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Authentication token is required');
    }

    const token = authHeader.split(' ')[1]; // Extract the token after "Bearer "
    let decoded;

    try {
        // Verify and decode the token
        decoded = jwt.verify(token, secretKey);
    } catch (err) {
        return res.status(401).send('Invalid or expired token');
    }

    const { role, Mail_Id } = decoded;

    // Find the user based on role and email
    let user;
    try {
        if (role === "user") {
            user = await Student.findOne({ Mail_Id });
        } else if (role === "Admin") {
            user = await Admin.findOne({ Mail_Id });
        } else if (role === "Instructor") {
            user = await Instructor.findOne({ Mail_Id });
        } else {
            return res.status(400).send('Invalid role');
        }
    } catch (err) {
        return res.status(500).send('Error fetching user from database');
    }

    if (!user) {
        return res.status(404).send('User not found');
    }

    // Validate the old password
    if (user.Password !== Old_Password) {
        return res.status(400).send('Incorrect old password');
    }

    // Validate the new password
    if (!passwordRegex.test(New_Password)) {
        return res.status(400).send(
            "Password should be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number, and one special character."
        );
    }

    // Ensure old and new passwords are not the same
    if (Old_Password === New_Password) {
        return res.status(400).send('Old and new passwords cannot be the same');
    }

    // Update the password
    try {
        user.Password = New_Password;
        await user.save(); // Save the updated user
        return res.send('Password changed successfully');
    } catch (err) {
        return res.status(500).send('Error updating password');
    }
});

module.exports = router;
