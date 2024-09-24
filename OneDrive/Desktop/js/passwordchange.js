const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const secretKey = 'your_secret_key'; 

/*const Schema_User = new mongoose.Schema({
    Id: Number,
    Password: String,
    Mail_Id: String,
    Education: String,
    Motive: String,
});

const Schema_Admin = new mongoose.Schema({
    Id: Number,
    Password: String,
    Mail_Id: String,
    Experience: String,
});

const Schema_Instructor = new mongoose.Schema({
    Id: Number,
    Password: String,
    Mail_Id: String,
    Experience: String,
    Exam_Set: Array,
});

const Student = mongoose.model('Student', Schema_User, 'User');
const Admin = mongoose.model('Admin', Schema_Admin, 'Admin');
const Instructor = mongoose.model('Instructor', Schema_Instructor, 'Instructor');

*/
main().catch(err => console.log(err));
async function main() {
    await mongoose.connect("mongodb+srv://yashsavera762:QgYYxYDUN4oCMIot@yashsv.fwwy2.mongodb.net/MyExam");
    console.log('Database Connected');
}

// Middleware for token authentication
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send('Access Denied: No Token Provided!');
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).send('Invalid Token');
        }
        req.user = user;
        next();
    });
}

// Password validation criteria
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

// Change password route
router.post('/change', authenticateToken, async (req, res) => {
    const { Old_Password, New_Password } = req.body;

    // Check if new password meets the criteria
    if (!passwordRegex.test(New_Password)) {
        return res.status(400).send("Password should be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number, and one special character.");
    }

    try {
        // Identify user role from JWT
        const { id, role } = req.user;
        let person;

        if (role === 'Student') {
            person = await Student.findOne({ Id: id });
        } else if (role === 'Admin') {
            person = await Admin.findOne({ Id: id });
        } else if (role === 'Instructor') {
            person = await Instructor.findOne({ Id: id });
        } else {
            return res.status(400).send('Invalid role');
        }

        // Check if old password matches the stored password
        if (person.Password !== Old_Password) {
            return res.status(400).send('Old password is incorrect');
        }

        // Prevent using the same old password
        if (Old_Password === New_Password) {
            return res.status(400).send('Old and new passwords cannot be the same');
        }

        // Update the password in the database
        person.Password = New_Password;
        await person.save();

        res.send('Password changed successfully');
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).send('An error occurred while processing your request.');
    }
});

module.exports = router;
