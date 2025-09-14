const express = require('express');
const { Student, Admin, Instructor, VerificationCode } = require('./login');

const router = express.Router();


router.post('/', async (req, res) => {
    const { mail_id, verificationCode } = req.body;
    

    try {
        let user = await Student.findOne({ Mail_Id: mail_id });
        if (!user) user = await Instructor.findOne({ Mail_Id: mail_id });
        if (!user) user = await Admin.findOne({ Mail_Id: mail_id });
        if (!user) {
            return res.status(401).json({ message: 'User with this Mail Id does not exist. Please sign up.' });
        }

        const codeRecord = await VerificationCode.findOne({ Mail_Id: mail_id });

        if (!codeRecord) {
            return res.status(401).json({ message: 'No verification code found. Please request a new one.' });
        }

       

        if (String(codeRecord.Verification_Code) !== String(verificationCode)) {
            return res.status(401).json({ message: 'Verification code does not match. Please enter the correct code.' });
        }
        res.status(200).json({ message: 'Verification successful' });
    } catch (e) {
        res.status(500).json({ message: 'Internal Server Error', error: e.message });
    }
});

router.post('/password', async (req, res) => {
    const { mail_id, Password } = req.body;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(Password)) return res.status(400).send("Please enter Password with minimum length 8 who contain atleast one special character ,one capital ,one small and one number ");
    let user = await Student.findOne({ Mail_Id: mail_id });
    if (!user) user = await Instructor.findOne({ Mail_Id: mail_id });
    if (!user) user = await Admin.findOne({ Mail_Id: mail_id });

    if (!user) {
        return res.status(401).json({ message: 'User with this Mail Id does not exist. Please sign up.' });
    }

    try {
       
        user.Password = Password;
        await user.save(); // Save the updated user document
        
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Error changing password. Please try again.', error: e.message });
    }
});


module.exports = router;
