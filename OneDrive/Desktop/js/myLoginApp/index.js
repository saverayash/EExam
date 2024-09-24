const express = require('express');
const path = require('path');

const app = express();

// Middleware to parse incoming requests with URL-encoded payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (like HTML files) from the current directory
app.use(express.static(path.join(__dirname)));

// Route to serve the HTML form
app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to handle form submission
app.post('/formPost', (req, res) => {
    const { id, password } = req.body;

    console.log('Form data received:', { id, password });

    // Check if the ID and password match
    if (id === '202203074' && password === 'yash') {
        res.redirect('/base.js'); // Redirect to base.js
    } else {
        res.send('Incorrect ID or Password'); // Send an error message
    }
});

// Serve base.js (or any other static files)
app.get('/base.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'base.js'));
});

// Start the server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
