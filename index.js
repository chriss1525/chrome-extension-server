require('dotenv').config();
const express = require('express');
const app = express();
const admin = require('firebase-admin')
const port = process.env.PORT || 3000;

require('./utils/db.js');

// Enable CORS for all requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

// import routes
app.use('/extension', require('./routes/index.js'));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
}
);
