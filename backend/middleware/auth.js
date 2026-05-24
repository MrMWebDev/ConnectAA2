const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('No token provided');
    }

    const token = authHeader.split(' ')[1];
    // format: "Bearer TOKEN"
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // attach user data to request
        next();

    }catch (error) {
        res.status(401).send('Invalid token');
    }
};