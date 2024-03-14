const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRouter = require('./routes/auth');
const app = express();
const PORT = 5000;
mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use('/auth', authRouter);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});