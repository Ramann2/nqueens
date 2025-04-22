const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const solverRouter = require('./routes/solver');  // Make sure the path is correct

// Middleware for parsing JSON and URL encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static('public')); 

// Serve the index.html for the root path
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');  // Send index.html for GET /
});

// Use the solver router for POST requests to '/solve'
app.use('/', solverRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
