const express = require('express');
const app = express();
const connectToDB = require('./config/db');

const cors = require('cors');

app.use(cors({ origin: process.env.CLIENT_ORIGIN || `http://localhost:3000` }));

connectToDB();

const port = process.env.PORT || 5000;

app.use(express.json({ extended: false })); //body parser
app.get('/', (req, res) => {
  res.send('Welcome!');
});
//Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profiles', require('./routes/api/profiles'));
app.use('/api/posts', require('./routes/api/posts'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
