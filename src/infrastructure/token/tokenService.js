const jwt = require('jsonwebtoken');

module.exports = ({ secret, expiresIn }) => ({
  sign: (userId) => jwt.sign({ sub: userId }, secret, { expiresIn, algorithm: 'HS256' }),
  verify: (token) => jwt.verify(token, secret, { algorithms: ['HS256'] }).sub,
});
