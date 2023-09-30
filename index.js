require('dotenv').config();
const express = require('express');
const app = express();
const admin = require('firebase-admin')
const port = process.env.PORT || 3000;

require('./utils/db.js');
// import routes
app.use('/extension', require('./routes/index.js'));

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
}
);
