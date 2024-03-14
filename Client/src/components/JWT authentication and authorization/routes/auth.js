
const express = require('express');
const router = express.Router();
const { register, login, protectedRoute } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');


router.post('/register', register);
router.post('/login', login);


router.get('/protected', authenticateToken, protectedRoute);

module.exports = router;



