const express = require('express');
const path = require('path');
const loginRoutes = require('./login.js');
const passwordChangeRoutes = require('./passwordchange.js');
const Privious_ExamRoutes = require('./Privious_Exams.js');
const app = express();

// Middleware to serve static files from the React app build
app.use(express.static(path.join(__dirname, 'build')));

// Middleware to parse incoming form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use('/', loginRoutes);
app.use('/change', passwordChangeRoutes);
app.use('/exams', Privious_ExamRoutes);

// Catch-all to send the React app for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'Index.jsx'));
});

// Start the server
const PORT = process.env.PORT || 5173;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
