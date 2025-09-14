const express = require('express');
const router = express.Router();
const { Answer_Sheet } = require('./Add_Exam_Paper'); 
const {Instructor} =require('./login');
const {Student}=require('./login');
const {Admin}=require('./login');
const app=express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

router.post('/all_exams', async (req, res) => {
    try {
       
        const { mail_id,role } = req.body;
        // console.log(req.body);
         if(role=="Instructor")
         {
        const instructor = await Instructor.findOne({Mail_Id:mail_id});

        if (!instructor) {
            return res.status(404).json({ error: "Instructor not found" });
        }
       
        const exams = instructor.Exam_Set;
       
        if (!exams || exams.length === 0) {
            return res.status(404).json({ error: "No exams found for this instructor" });
        }

       
        const answerSheets = await Answer_Sheet.find({ _id: { $in: exams } });
       
         
      
        res.json({answerSheets:answerSheets });
    }
    else
    {
        const admin=await Admin.findOne({Mail_Id:mail_id});
        if (!admin) {
            return res.status(404).json({ error: "Admin not found" });
        }
        const answerSheets=await Answer_Sheet.find();
        res.json({answerSheets});
    }
    } catch (error) {
        console.error("Error fetching exams or answer sheets:", error);
        res.status(500).json({ error: "An error occurred while fetching data" });
    }
});
router.post('/check/:id', async (req, res) => {
    try {
      
        const { id } = req.params;
        const answerSheets = await Answer_Sheet.findOne({ _id: id });
        if (!answerSheets) {
            return res.status(404).json({ message: 'Answer sheets for this paper cannot be found' });
        }

        const results = [];

        
        
            for (const response of answerSheets.Responses) {
                const { Student_id, Answers } = response;
                const Marks = [];
                let Total_Marks = 0;

              
                answerSheets.Questions.forEach((question,index) => {
                    const {
                        questionType,
                        questionMarks,
                        correctAnswer,
                        range,
                        negativeMarking,
                        negativePercentage,
                        isSCQ,
                        _id: questionId,
                    } = question;

                    // Find the corresponding answer in the Answers array
                    const answerObj = Answers.find((ans) => ans.questionId === questionId.toString());
                    const answer = answerObj ? answerObj.answer : null;
                    let marks = 0;

                    if (answer === null) {
                        // No answer provided for this question
                        Marks.push(0);
                        return;
                    }

                    // Calculate marks based on question type
                    switch (questionType) {
                        case 'text':
                        //    console.log(answer+" yash "+correctAnswer[0]);
                            if (correctAnswer[0]===answer) {
                                marks = questionMarks;
                            } else if (negativeMarking) {
                                marks = -(questionMarks * (negativePercentage / 100));
                            }
                            break;

                        case 'integer':
                            const numericAnswer = parseFloat(answer);
                            if (
                                range &&
                                Array.isArray(range) &&
                                range.length === 2 &&
                                numericAnswer >= range[0] &&
                                numericAnswer <= range[1]
                            ) {
                                marks = questionMarks;
                            } else if (negativeMarking) {
                                marks = -(questionMarks * (negativePercentage / 100));
                            }
                            console.log(numericAnswer+" "+range[0]+" "+range[1]);
                            break;

                        case 'choice':
                            if (isSCQ) {
                                // Single-choice question logic
                                if (correctAnswer.includes(answer)) {
                                    marks = questionMarks;
                                } else if (negativeMarking) {
                                    marks = -(questionMarks * (negativePercentage / 100));
                                }
                            } else {
                                
                                const correctSet = new Set(correctAnswer);
                                const answeredSet = new Set(answer);
                                if (
                                    [...answeredSet].every((ans) => correctSet.has(ans)) &&
                                    answeredSet.size === correctSet.size
                                ) {
                                    marks = questionMarks;
                                } else if (negativeMarking) {
                                    marks = -(questionMarks * (negativePercentage / 100));
                                }
                                
                            }
                            break;

                        default:
                            console.warn(`Unknown question type: ${questionType}`);
                    }

                    Marks.push(marks);
                   
                    Total_Marks += marks ?? 0; // Ensure marks are never null

                    if (index === answerSheets.Questions.length - 1) {
                        response.Total_Score = Total_Marks??0;
                    }
                }
            );

                
                response.Marks = Marks??0;
          
                 
                results.push({
                    Student_id,
                    Marks,
                    Total_Marks,
                });
            }

            
            await answerSheets.save();

        const students = [];

const responses = answerSheets?.Responses || []; // Get the responses array
for (const response of responses) {
    const studentId = response.Student_id;
    const student = await Student.findOne({ _id: studentId }).lean(); // Fetch the student document
    if (student) {
        const totalScore = response.Total_Score??0; // Assume `Score` is stored in the response
        students.push({
            Student_Id: student._id, 
            Student_id: student.Id,
            Total_Score: totalScore,
        });
    }
}

res.status(200).json({
    message: 'Answer sheets checked successfully',
    students,
   
});
    } catch (error) {
        console.error('Error checking answer sheets:', error);
        res.status(500).json({ message: 'Failed to check answer sheets', error: error.message });
    }
});
router.post('/:id', async (req, res) => { 
    try {
        const { id } = req.params;

        const answerSheets = await Answer_Sheet.findOne({ _id: id });
        if (!answerSheets) {
            return res.status(404).json({ message: 'Answer sheets for this paper cannot be found' });
        }

        let results = []; 

        if (answerSheets.Responses) {
            for (const response of answerSheets.Responses) {
                results.push({
                    Student_id: response.Student_id,
                    Marks: response.Marks,
                    Total_Marks: response.Total_Score??0, 
                });
            }
        }

        await answerSheets.save();

        let students = []; 
        const updatedAnswerSheet = await Answer_Sheet.findOne({ _id: id }).lean(); 
        const responses = updatedAnswerSheet?.Responses || []; 

        for (const response of responses) {
            const studentId = response.Student_id;
            const student = await Student.findOne({ _id: studentId }).lean();
            if (student) {
                students.push({
                    Student_Id: student._id,
                    Student_id: student.Id, 
                    Total_Score: response.Total_Score??0,
                });
            }
        }
        const status=updatedAnswerSheet.Checked;
        console.log(students);
        res.status(200).json({
            message: 'Answer sheets checked successfully',
            students,
            status,
        });
    } catch (error) {
        console.error('Error checking answer sheets:', error);
        res.status(500).json({ message: 'Failed to check answer sheets', error: error.message });
    }
});

router.post('/toggle/:id', async (req, res) => {
    const { mail_id, role } = req.body;
    let model;
   const {id}=req.params;
   console.log("yash second");
    // Assign model based on role
    if (role === 'Instructor') {
        model = Instructor;
    } else if (role === 'Admin') {
        model = Admin;
    } else {
        return res.status(400).send("Invalid role provided");
    }

    try {
        // Fetch the Instructor if role is Instructor
        if (model === Instructor) {
            const inst = await Instructor.findOne({ Mail_Id: mail_id });
            if (!inst) {
                return res.status(404).send("Instructor not found");
            }
            // Check if the instructor has the exam ID
            if (!inst.Exam_Set.includes(id)) {
                return res.status(400).send("Exam not set by you");
            }
        }

       
       const answerSheet = await Answer_Sheet.findById(id);
               if (!answerSheet) {
            return res.status(404).send("Answer sheet not found");
        }
        answerSheet.Checked = !answerSheet.Checked;
        await answerSheet.save();

        res.status(200).send({ message: "Answer sheet status toggled", checked: answerSheet.Checked });
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while processing the request");
    }
});
router.post('/:exam_id/:student_id', async (req, res) => {
    const { marks, Total_Score } = req.body;
    const { exam_id, student_id } = req.params;
   

    try {
        // Find the answer sheet for the given exam and student
        const answerSheet = await Answer_Sheet.findOne({ _id: exam_id });

        if (!answerSheet) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // Check if the student exists in the response list
        const studentResponse = answerSheet.Responses.find(
            (response) => response.Student_id === student_id
        );

        if (!studentResponse) {
            return res.status(404).json({ message: 'Student response not found' });
        }

        const marksArray = Object.values(marks);
          
        studentResponse.Marks = marksArray;

        Tot_Sc=0;
        marksArray.forEach((mk)=>{Tot_Sc+=mk ;console.log(mk)});
        studentResponse.Total_Score = Tot_Sc;

        await answerSheet.save();

        res.status(200).json({ message: 'Marks updated successfully' });
    } catch (error) {
        console.error('Error updating marks:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});



module.exports = router;
