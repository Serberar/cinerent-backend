import { randomUUID } from 'node:crypto';
import { badRequest } from './errors';

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_DAYS = 30;

export interface ProductData {
  userId: string;
  movieId: string;
  movieTitle: string;
  dias: number;
}

export interface ProductProps extends ProductData {
  id: string;
  rentedAt?: Date;
  returnedAt?: Date | null;
}

export class Product {
  readonly id: string;
  readonly movieId: string;
  readonly userId: string;
  readonly movieTitle: string;
  readonly dias: number;
  readonly rentedAt: Date;
  returnedAt: Date | null;

  constructor({ id, movieId, userId, movieTitle, dias, rentedAt = new Date(), returnedAt = null }: ProductProps) {
    this.id = id;
    this.movieId = movieId;
    this.userId = userId;
    this.movieTitle = movieTitle;
    this.dias = dias;
    this.rentedAt = rentedAt;
    this.returnedAt = returnedAt;
  }

  static create({ userId, movieId, movieTitle, dias }: ProductData): Product {
    if (!userId || !movieId || !movieTitle) throw badRequest('Faltan datos por rellenar');
    if (!Number.isInteger(dias) || dias < 1 || dias > MAX_DAYS) {
      throw badRequest(`Los días deben ser un número entre 1 y ${MAX_DAYS}`);
    }
    return new Product({ id: randomUUID(), userId, movieId, movieTitle, dias });
  }

  belongsTo(userId: string): boolean {
    return this.userId === userId;
  }

  total(pricePerDay: number): number {
    return Math.round(this.dias * pricePerDay * 100) / 100;
  }

  isExpired(now = new Date()): boolean {
    return this.rentedAt.getTime() + this.dias * DAY_MS <= now.getTime();
  }

  isActive(): boolean {
    return this.returnedAt === null;
  }

  markAsReturned(now = new Date()): Date {
    this.returnedAt ??= now;
    return this.returnedAt;
  }
}
