const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse the body of the request
app.use(bodyParser.urlencoded({ extended: true }));
//console.log('Serving index.html');
// Serve the HTML file
app.get('/', (req, res) => {
    console.log('Serving index.html');
  res.sendFile(path.join(__dirname,'index.html'));
});

// Handle form submission
app.post('/submit', (req, res) => {
  const { id, password } = req.body;
  console.log(`ID: ${id}, Password: ${password}`);
  res.send('Form submitted successfully!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
