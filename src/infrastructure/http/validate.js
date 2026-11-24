const { badRequest } = require('../../domain/errors');

// Exige que los campos sean textos no vacíos y devuelve solo esos campos
module.exports = function requireText(source, fields, message) {
  const data = source ?? {};
  for (const field of fields) {
    if (typeof data[field] !== 'string' || !data[field].trim()) throw badRequest(message);
  }
  return Object.fromEntries(fields.map((field) => [field, data[field]]));
};
