
const jwt = require('jsonwebtoken');
exports.authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - Missing token' });
    }

    jwt.verify(token, 'uttam123', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden - Invalid token' });
        }

        req.user = user; 
        next(); 
    });
};
