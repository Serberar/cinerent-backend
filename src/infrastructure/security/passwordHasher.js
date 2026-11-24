const bcrypt = require('bcryptjs');

module.exports = {
  hash: (password) => bcrypt.hash(password, 12),
  compare: (password, hash) => bcrypt.compare(password, hash),
};
