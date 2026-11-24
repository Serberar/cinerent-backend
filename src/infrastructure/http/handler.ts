import type { Request, RequestHandler, Response } from 'express';

// Convierte una función async en un handler de Express y pasa los errores al manejador común
export const handle = (action: (req: Request, res: Response) => Promise<unknown>, status = 200): RequestHandler => (
  async (req, res, next) => {
    try {
      const body = await action(req, res);
      res.status(status).json(body);
    } catch (error) {
      next(error);
    }
  }
);
