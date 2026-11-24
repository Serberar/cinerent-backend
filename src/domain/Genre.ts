import { randomUUID } from 'node:crypto';
import { badRequest } from './errors';

const DEFAULT_PRICE = 2;

export interface GenreProps {
  id: string;
  name: string;
  price?: number;
}

function validName(name: unknown): string {
  if (typeof name !== 'string' || !name.trim()) throw badRequest('El nombre del género es requerido');
  return name.trim();
}

function validPrice(price: unknown): number {
  const value = Number(price);
  if (!Number.isFinite(value) || value < 0) throw badRequest('El precio debe ser un número positivo');
  return value;
}

export class Genre {
  readonly id: string;
  name: string;
  price: number;

  constructor({ id, name, price = DEFAULT_PRICE }: GenreProps) {
    this.id = id;
    this.name = name;
    this.price = price;
  }

  static create({ name, price = DEFAULT_PRICE }: { name: unknown; price?: unknown }): Genre {
    return new Genre({ id: randomUUID(), name: validName(name), price: validPrice(price) });
  }

  update({ name, price }: { name?: unknown; price?: unknown }): void {
    if (name !== undefined) this.name = validName(name);
    if (price !== undefined) this.price = validPrice(price);
  }
}
