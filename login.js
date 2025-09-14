const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const path = require('path');
const { Schema } = mongoose;
const crypto = require('crypto');

const SECRET_KEY="I_AM_learning_JWT";

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 465, 
    secure: true,
    auth: {
        user: 'ysexam100@gmail.com', 
        pass: 'hczusdhemhwdtybl', 
    },
});

// Function to send emails
function sendMail(to, sub, msg) {
    transporter.sendMail(
        {
            to: to,
            subject: sub,
            html: msg,
        },
        (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent successfully:', info.response);
            }
        }
    );
}

function generateRandomString() {
    return crypto.randomBytes(4).toString('hex'); // Generates a string of 8 characters
}
const Schema_User = new Schema({
    Id: String,
    Password: String,
    Mail_Id: String,
    Education: String,
    Exams_Given:[],
    Doubts:[],
});

const Schema_Admin = new Schema({
    Id: String,
    Password: String,
    Mail_Id: String,
    Experience: String,
    Exam_Set:Array,
});

const Schema_Instructor = new Schema({
    Id: String,
    Password: String,
    Mail_Id: String,
    Experience: String,
    Exam_Set: Array,
    Doubts:[],
});

const Schema_VerificationCode =new Schema({
        Mail_Id:String,
        Verification_Code:String,
});
const Student = mongoose.model('Student', Schema_User, 'User');
const Admin = mongoose.model('Admin', Schema_Admin, 'Admin');
const Instructor = mongoose.model('Instructor', Schema_Instructor, 'Instructor');
const VerificationCode=mongoose.model('VerificationCode',Schema_VerificationCode,'VerificationCode');





// POST login route
// POST login route
// POST login route
router.post('/login', async (req, res) => {
    const { id, password } = req.body;
    console.log('Form data received:', { id, password });

    try {
        // Check if user is a student
        const user = await Student.findOne({ Id: id, Password: password });
        if (user) {
            console.log("User login");
            const token = jwt.sign({ role: 'user', Mail_Id: user.Mail_Id ,Id:user.Id}, SECRET_KEY, { expiresIn: '1h' });
            return res.json({ token, role: 'user' ,Id:id}); 
        }

        // Check if user is an admin
        const admin = await Admin.findOne({ Id: id, Password: password });
        if (admin) {
            console.log("Admin login");
            const token = jwt.sign({ role: 'Admin', Mail_Id: admin.Mail_Id,Id:id }, SECRET_KEY, { expiresIn: '1h' });
            return res.json({ token, role: 'Admin',Id:id }); 
        }

       
        const instructor = await Instructor.findOne({ Id: id, Password: password });
        if (instructor) {
            console.log("Instructor login");
            const token = jwt.sign({ role: 'Instructor', Mail_Id: instructor.Mail_Id,Id:id }, SECRET_KEY, { expiresIn: '1h' });
            return res.json({ token, role: 'Instructor' ,Id:id}); 
        }

        console.log(instructor);
        return res.status(401).json({ message: 'Incorrect ID or Password' });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
});




router.post('/signup', async (req, res) => {
    const { id, password, mail_id, education } = req.body;

    // Validate input
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail_id)) return res.status(400).send("Invalid email format");

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) return res.status(400).send("Password must meet the required complexity");

    try {
        // Check if email or ID already exists
        const exist1 = await Student.findOne({ Mail_Id: mail_id });
        const exist2 = await Student.findOne({ Id: id });
        const exist3=await Instructor.findOne({Mail_Id:mail_id});
        const exist4=await Instructor.findOne({Id:id});
        const exist5=await Admin.findOne({Mail_Id:mail_id});
        const exist6=await Admin.findOne({Id:id});
        if (exist1 || exist2||exist3||exist4||exist5||exist6) return res.status(409).send("Email or Username is already in use");

        // Create new student
        // await Student.create({
        //     Id: id,
        //     Password: password,
        //     Mail_Id: mail_id,
        //     Education: education,
        //     Exams_Given: [],
        //     Doubts: [],
        // });

          const code=generateRandomString();
          const message = `
        <p>Your Verification Code is <b>${code}</b>.</p>
        <p>If this wasn't you, please report it to this email ID: ysexam100@gmail.com</p>
    `;

    await VerificationCode.updateOne(
        { Mail_Id: mail_id },
        { $set: { Verification_Code: code } },
        { upsert: true }
    );

    // ✅ Ensure sendMail() is correctly defined and awaited if needed
   
       
         sendMail(mail_id,'Verification of Email Id for YSExam',message);
        res.status(200).send("Signup successful and email sent");
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send("An error occurred during signup");
    }
});


router.post('/verify-code', async (req, res) => {
    const {id, password, mail_id, education , code } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail_id)) return res.status(400).send("Invalid email format");

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) return res.status(400).send("Password must meet the required complexity");

try {
       
        const exist1 = await Student.findOne({ Mail_Id: mail_id });
        const exist2 = await Student.findOne({ Id: id });
        const exist3=await Instructor.findOne({Mail_Id:mail_id});
        const exist4=await Instructor.findOne({Id:id});
        const exist5=await Admin.findOne({Mail_Id:mail_id});
        const exist6=await Admin.findOne({Id:id});
        if (exist1 || exist2||exist3||exist4||exist5||exist6) return res.status(409).send("Email or Username is already in use");

        
       

         
    const check = await VerificationCode.findOne({ Mail_Id: mail_id });

    if (!check) return res.status(400).send("Verification code not found. Please sign up again.");

    if (check.Verification_Code === code) {
        await Student.create({
            Id: id,
            Password: password,
            Mail_Id: mail_id,
            Education: education,
            Exams_Given: [],
            Doubts: [],
        });
        res.status(200).send("Signup successful");
    } else {
        res.status(400).send("Incorrect verification code");
    }
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send("An error occurred during signup");
    }
});
router.post('/send-verification', async (req,res) => {
          const {mail_id}=req.body;
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail_id)) return res.status(400).send("Invalid email format");
    const code=generateRandomString();
    const message = `
  <p>Your Verification Code is <b>${code}</b>.</p>
  <p>If this wasn't you, please report it to this email ID: ysexam100@gmail.com</p>`;

await VerificationCode.updateOne(
  { Mail_Id: mail_id },
  { $set: { Verification_Code: code } },
  { upsert: true }
);

   sendMail(mail_id,'Verification of Email Id for YSExam',message);
  res.status(200).send("Verification Sent Successfully");
});

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send('Invalid token');
    }
};

 module.exports = {
    router,
    Student,
    Instructor,
    Admin,
    VerificationCode,
}