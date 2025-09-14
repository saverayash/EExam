const express = require('express');
const router = express.Router();
const { Student, Instructor, Admin } = require('./login.js');

router.post('/', async (req, res) => {
    try {
        const { Mail_Id, role } = req.body;
        
        if (!Mail_Id || !role) {
            return res.status(400).json({ error: "Mail ID and role are required." });
        }

        let userData;
        if (role === "Student") {
            userData = await Student.findOne({ Mail_Id });
        } else if (role === "Instructor") {
            userData = await Instructor.findOne({ Mail_Id });
        } else if (role === "Admin") {
            userData = await Admin.findOne({ Mail_Id });
        } else {
            return res.status(400).json({ error: "Invalid role." });
        }

        if (!userData) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json(userData);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: "Server error." });
    }
});

module.exports = router;
