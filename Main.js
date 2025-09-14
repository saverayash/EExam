const express = require('express');
const path = require('path');
const {router}= require('./login.js');

const passwordChangeRoutes = require('./passwordchange.js');
const {router2}=require('./Ask_Doubt.js');
const Ask_DoubtRoutes=router2;
const Add_AnotherRoutes=require('./Add_Another.js');
const {router1}=require('./Add_Exam_Paper.js');
const Add_Exam_PaperRoutes=router1;
//const Check_Examp_PaperRoutes=require('./Check_Exam_Paper.js');
const ExamsRoutes=require('./Exams.js');
const Give_ExamRoutes=require('./Give_Exam.js');
const Privious_ExamRoutes=require('./Privious_Exams.js');
const Submit_ExamRoutes=require('./Submit_Exam.js');
const Check_Exam_PaperRoutes=require('./Check_Exam_Paper.js');
const MyExamRoutes=require('./MyExam.js');
const Doubt_StudentRoutes=require('./Doubt_Student.js');
const Doubt_InstructorRoutes=require('./Doubt_Instructor.js');
const Answer_DoubtRoutes=require('./Answer_Doubt.js');
const See_ResponseRoutes=require('./See_Response.js');
const ForgotPasswordRoutes=require('./ForgotPassword.js');
const ProfileRoutes=require('./Profile.js');
const cors = require('cors');
const mongoose = require('mongoose');


main().catch(err => console.log(err));
async function main() {
    await mongoose.connect("mongodb+srv://yashsavera762:Jeemain9876@yashsv.fwwy2.mongodb.net/YSExam100");
    // console.log('Database Connected');
}


// Middleware to parse incoming requests
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
const app = express();

// Allow all origins (use cautiously in production)
app.use(cors());

// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use('/', router);
app.use('/change', passwordChangeRoutes);
app.use('/privious_exams', Privious_ExamRoutes);
app.use('/ask',Ask_DoubtRoutes);
app.use('/add',Add_AnotherRoutes);
app.use('/add_exam_paper',router1);
//app.use('/add_exam_paper',Add_Exam_PaperRoutes);
//app.use('/check_exam_paper',Check_Examp_PaperRoutes);
app.use('/exams',ExamsRoutes);
app.use('/give_exam',Give_ExamRoutes);
app.use('/submit_exam',Submit_ExamRoutes);
app.use('/check_exam_paper',Check_Exam_PaperRoutes);
app.use('/myexam',MyExamRoutes);
app.use('/doubt_student',Doubt_StudentRoutes);
app.use('/doubt_instructor',Doubt_InstructorRoutes);
app.use('/answer_doubt',Answer_DoubtRoutes);
app.use('/see_response',See_ResponseRoutes);
app.use('/forgotpassword',ForgotPasswordRoutes);
app.use('/profile',ProfileRoutes);
app.get('*', (req, res) => {
    res.status(404).send('Not Found');
});

// Start the server on a default port
const PORT = process.env.PORT || 3000; // This uses the environment variable or falls back to 3000
app.listen(PORT, () => {
   // console.log(`Server is running on port ${PORT}`);
});
