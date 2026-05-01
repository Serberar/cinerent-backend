const userRepo = require('../db/userRepo');

module.exports = async function admin(req, res, next) {
  try {
    const user = await userRepo.findById(req.userId);
    if (user.role === 'ADMIN') {
      next();
    } else {
      res.status(403).json({ error: 'Acceso no autorizado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
