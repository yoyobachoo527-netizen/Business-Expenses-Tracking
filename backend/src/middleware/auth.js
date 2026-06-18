const jwt = require('jsonwebtoken');
const { Employee } = require('../models');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token required' });
    }

    const token = authHeader.substring(7);
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const employee = await Employee.findOne({
      where: { id: decoded.id, isActive: true },
    });

    if (!employee) {
      return res.status(401).json({ error: 'Employee not found or inactive' });
    }

    req.employee = employee;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

module.exports = auth;
