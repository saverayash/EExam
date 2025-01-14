const express = require('express');
const app = express();
const router = express.Router();
const { Answer_Sheet } = require('./Add_Exam_Paper'); // Import schemas
const { Student } = require('./login'); // Import Student schema
const cors = require('cors');
app.use(cors());
app.use(express.json());

router.post('/', async (req, res) => {
    try {
        console.log(req.body);
        const { Student_id, exam_id } = req.body;

        // Validate inputs
        if (!Student_id || !exam_id) {
            return res.status(400).json({ message: 'Student ID and Exam ID are required' });
        }

        // Fetch the specific response for the student in the given exam
        const answerSheet = await Answer_Sheet.findOne({
            _id: exam_id,
            Responses: { $elemMatch: { Student_id } }, // Match the Student_id in the Responses array
        });

        if (!answerSheet) {
            return res.status(404).json({ message: 'No response found for this student in the specified exam' });
        }

        // Extract the specific response from the Responses array
        const response = answerSheet.Responses.find((resp) => resp.Student_id === Student_id);
         console.log(response);
        // Send the response
        res.status(200).json({
         exam:answerSheet,
           answers:response,
        });
    } catch (error) {
        console.error('Error fetching student response:', error);
        res.status(500).json({ message: 'Failed to fetch student response', error: error.message });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the answer sheet by ID
        const answerSheet = await Answer_Sheet.findOne({ _id: id });
        if (!answerSheet) {
            return res.status(404).json({ message: 'Answer sheets for this paper cannot be found' });
        }

        // Collect student data from responses
        const allStudentData = await Promise.all(
            answerSheet.Responses.map(async (response) => {
                const { Student_id, Answers, Marks, Total_Score } = response;

                try {
                    // Fetch student details
                    const student = await Student.findOne({ _id: Student_id });
                    if (!student) {
                        console.warn(`Student with ID ${Student_id} not found`);
                        return null; // Skip if student not found
                    }

                    // Return combined data
                    return {
                        Student_Id: student._id,
                        Student_id: student.Id, // Assuming `name` is a field in Student schema
                        Answers,
                        Marks,
                        Total_Score,
                    };
                } catch (err) {
                    console.error(`Error fetching student with ID ${Student_id}:`, err);
                    return null; // Skip if an error occurs
                }
            })
        );

        // Filter out null results
        const filteredStudentData = allStudentData.filter((data) => data !== null);

        // Send the response
        res.status(200).json({
            message: 'All students data fetched successfully',
            students: filteredStudentData,
        });
    } catch (error) {
        console.error('Error checking answer sheets:', error);
        res.status(500).json({ message: 'Failed to check answer sheets', error: error.message });
    }
});


module.exports = router;
