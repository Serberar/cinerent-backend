// Convierte una función async en un handler de Express y pasa los errores al manejador común
module.exports = (action, status = 200) => async (req, res, next) => {
  try {
    res.status(status).json(await action(req));
  } catch (error) {
    next(error);
  }
};
