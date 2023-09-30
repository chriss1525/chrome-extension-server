require('dotenv').config();
const express = require('express');
const app = express();
const admin = require('firebase-admin')
const port = process.env.PORT || 3000;

require('./utils/db.js');
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    // ... other CORS headers ...
    next();
});
// import routes
app.use('/extension', require('./routes/index.js'));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
}
);
