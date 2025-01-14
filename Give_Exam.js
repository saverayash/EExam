const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());


const { Paper } = require('./Add_Exam_Paper');


router.post('/', async (req, res) => {
    try {
        const exams = await Paper.find({});
        res.json(exams);
    } catch (error) {
        console.error('Error fetching exams:', error);
        res.status(500).json({ message: 'Failed to fetch exams', error: error.message });
    }
});

// Endpoint to fetch specific exam by ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const exam = await Paper.findById(id);
        if (exam) {
            res.json(exam);
        } else {
            res.status(404).json({ message: 'Exam not found' });
        }
    } catch (error) {
        console.error('Error fetching exam:', error);
        res.status(500).json({ message: 'Failed to fetch exam', error: error.message });
    }
});

module.exports = router;
