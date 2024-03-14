
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


exports.register = async (req, res) => {
    try {
        const { username,email, password } = req.body;

        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);
          console.log(hashedPassword);
        
        await User.create({
            username,
            email,
            password: hashedPassword
        });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        
        const user = await User.findOne({ username });

        
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        
        const token = jwt.sign({ username: user.username }, 'uttam123', { expiresIn: '365d' });
        res.cookie("uid",token);
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


exports.protectedRoute = (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
};
