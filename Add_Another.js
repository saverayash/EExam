const express = require('express');
const { Student, Instructor, Admin } = require('./login'); // Adjust the path as necessary
const router = express.Router();
const cors = require('cors');
const app = express();
app.use(cors());
const nodemailer=require('nodemailer');

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
async function sendMail(to, sub, msg) {
  try {
      const info = await transporter.sendMail({
          to: to,
          subject: sub,
          html: msg,
      });
      console.log('Email sent successfully:', info.response);
  } catch (error) {
      console.error('Error sending email:', error);
      throw error; // Optional: throw to let the calling function know about the failure
  }
}
router.post('/', async (req, res) => {
  const { option, Id, Password, Mail_Id, Education ,My_Mail_Id} = req.body;

  if (!option || !Id || !Password || !Mail_Id) {
    return res.status(400).send('All required fields must be provided.');
  }

  try {
    let Model, newUserData;

    
    if (option === 'student') {
      Model = Student;
      newUserData = { Id, Password, Mail_Id, Education };
    } else if (option === 'instructor') {
      Model = Instructor;
      newUserData = { Id, Password, Mail_Id, Experience: null,Dounts:[], Exam_Set: [] };
    } else if (option === 'admin') {
      Model = Admin;
      newUserData = { Id, Password, Mail_Id ,Experience: null,Exam_Set:[]};
    } else {
      return res.status(400).send('Invalid option selected.');
    }

   
    const existingUser = await Model.findOne({
      $or: [{ Id }, { Mail_Id }],
    });

    if (existingUser) {
      return res.status(400).send('User with this Id or Mail already exists');
    }
    const message = `
    <p>Hiiii</p>
    <p>New account is created from your Mail Id ${Mail_Id} by Our Admin Id ${My_Mail_Id}</p>
    <p>Your role is ${Model.modelName}</p> <!-- Show model name -->
    <p>Your Id is ${Id}</p>
    <p>Your Password is ${Password}</p>
    <p>If this activity seems suspicious, please report it to this email ID: ysexam100@gmail.com</p>
  `;
     await sendMail(Mail_Id,'New accout is creted  from your mail id',message)
    await Model.create(newUserData);

    return res.status(201).send(`${option.charAt(0).toUpperCase() + option.slice(1)} added successfully.`);
  } catch (error) {
    console.error('Error adding user:', error.message);
    return res.status(500).send('An error occurred while adding the user.');
  }
});

module.exports = router;
