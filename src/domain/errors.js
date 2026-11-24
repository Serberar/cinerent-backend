class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'AppError';
    this.status = status;
  }
}

const badRequest = (message) => new AppError(message, 400);
const unauthorized = (message) => new AppError(message, 401);
const forbidden = (message) => new AppError(message, 403);
const notFound = (message) => new AppError(message, 404);
const conflict = (message) => new AppError(message, 409);

module.exports = { AppError, badRequest, unauthorized, forbidden, notFound, conflict };
