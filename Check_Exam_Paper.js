const express = require('express');
const router = express.Router();
const { Answer_Sheet } = require('./Add_Exam_Paper'); 
const {Instructor} =require('./login');
const {Student}=require('./login');
const app=express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

router.post('/all_exams', async (req, res) => {
    try {
        
        const { mail_id } = req.body;

        // Fetch the instructor document by ID
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
    } catch (error) {
        console.error("Error fetching exams or answer sheets:", error);
        res.status(500).json({ error: "An error occurred while fetching data" });
    }
});
router.post('/:id', async (req, res) => {
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
                            //console.log(numericAnswer+" "+range[0]+" "+range[1]);
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
                                // Multi-choice question logic
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
                    Total_Marks += marks;
                    if (index === answerSheets.Questions.length - 1) {
                        response.Total_Score = Total_Marks;
                    }
                }
            );

                // Store calculated marks in response
                response.Marks = Marks;

                results.push({
                    Student_id,
                    Marks,
                    Total_Marks,
                });
            }

            // Mark the answer sheet as checked
            answerSheets.Checked = true;
            await answerSheets.save();

        const students = []; // Initialize an empty array

// Assume `studentIds` is an array of _id values for the students whose data you want to fetch
const answerSheet = await Answer_Sheet.findOne({ _id: id }); // Fetch the Answer_Sheet document
const responses = answerSheet?.Responses || []; // Get the responses array

// Iterate through the responses to populate the `students` array
for (const response of responses) {
    const studentId = response.Student_id;
    const student = await Student.findOne({ _id: studentId }).lean(); // Fetch the student document
    if (student) {
        const totalScore = response.Total_Score; // Assume `Score` is stored in the response
        students.push({
            Student_Id: student._id, 
            Student_id: student.Id,
            Total_Score: totalScore,
        });
    }
}
console.log(students);
res.status(200).json({
    message: 'Answer sheets checked successfully',
    students,
});
    } catch (error) {
        console.error('Error checking answer sheets:', error);
        res.status(500).json({ message: 'Failed to check answer sheets', error: error.message });
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

        // Update marks and total score
        studentResponse.Marks = marksArray;
        studentResponse.Total_Score = Total_Score;

        // Save the updated document
        await answerSheet.save();

        res.status(200).json({ message: 'Marks updated successfully' });
    } catch (error) {
        console.error('Error updating marks:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
});
module.exports = router;
