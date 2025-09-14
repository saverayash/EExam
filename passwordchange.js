const express = require('express');
const router = express.Router();
const { Instructor, Admin, Student } = require('./login'); 

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/; // Password validation regex


router.post('/', async (req, res) => {
    const { Old_Password, New_Password, Mail_Id, role } = req.body;

  
    let model;
    if (role === 'user') model = Student;
    else if (role === 'Instructor') model = Instructor;
    else if (role === 'Admin') model = Admin;
    else return res.status(400).send('Invalid role');

    try {
        
        const user = await model.findOne({ Mail_Id: Mail_Id });
       
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Fix: Access user.Password after ensuring user exists
        if (user.Password !== Old_Password) {
            return res.status(400).send('Incorrect old password');
        }

     
        if (!passwordRegex.test(New_Password)) {
            return res.status(400).send(
                'Password should be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one number, and one special character.'
            );
        }

        // Ensure old and new passwords are not the same
        if (Old_Password === New_Password) {
            return res.status(400).send('Old and new passwords cannot be the same');
        }

       
        user.Password = New_Password;
        await user.save();

        return res.status(200).send('Password changed successfully');
    } catch (err) {
        console.error(err);
        return res.status(400).send('Error updating password');
    }
});

module.exports = router;
