const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { Schema } = mongoose;

// Connect to MongoDB
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect("mongodb+srv://yashsavera762:QgYYxYDUN4oCMIot@yashsv.fwwy2.mongodb.net/MyExam");
    console.log('Database Connected');
}

// Define exam schema
const examSchema = new Schema({
    Id: Number,
    Password: String,
    Date: Date,
    Time: Number,
    Duration: Number,
    Instruction: String,
    Score: Number,
    Rank: Number,
    Percentile: Number,
    Total_Participation: Number,
});

const Exams = mongoose.model('Exams', examSchema, 'Exams');

// Route to fetch all exams sorted by recency
router.get('/', async (req, res) => {
    try {
        const exams = await Exams.find().sort({ Date: -1 }).select('Id Instruction Date Time');
        res.json(exams);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error fetching exams');
    }
});

// Route for individual exam (redirect)
router.get('/:id', (req, res) => {
    const examId = req.params.id;
    res.send(ExamPaper.html);
});

module.exports = router;
