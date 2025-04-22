const express = require('express');
const bodyParser = require('body-parser');
const serverless = require('serverless-http'); // Add this
const app = express();
const solverRouter = require('./routes/solver');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files and routes
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});
app.use('/', solverRouter);

// Export for Vercel
module.exports.handler = serverless(app);

// Keep this for local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}