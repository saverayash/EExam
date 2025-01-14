const express = require('express');
const router = express.Router();
const { Answer_Sheet } = require('./Add_Exam_Paper'); // Import schemas

router.post('/', async (req, res) => {
    try {
        const { title } = req.body;

        // Fetch the exam paper by title
       /* const paper = await Paper.findOne({ Title: title });
        if (!paper) {
            return res.status(404).json({ message: 'Paper with this title cannot be found' });
        }*/

        // Fetch all associated answer sheets
        const answerSheets = await Answer_Sheet.find({ Title: title });
        if (!answerSheets || answerSheets.length === 0) {
            return res.status(404).json({ message: 'Answer sheets for this paper cannot be found' });
        }

        const results = [];

        // Process each answer sheet
        for (const answerSheet of answerSheets) {
            for (const response of answerSheet.Responses) {
                const { Student_id, Answers } = response;
                const Marks = [];
                let Total_Marks = 0;

                // Evaluate each question in the paper
                answerSheet.Questions.forEach((question,index) => {
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
                    if (index === answerSheet.Questions.length - 1) {
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
            answerSheet.Checked = true;
            await answerSheet.save();
        }

        res.status(200).json({
            message: 'Answer sheets checked successfully',
            results,
        });
    } catch (error) {
        console.error('Error checking answer sheets:', error);
        res.status(500).json({ message: 'Failed to check answer sheets', error: error.message });
    }
});

module.exports = router;
