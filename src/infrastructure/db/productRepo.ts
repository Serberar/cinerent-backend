import type { Product as ProductRow } from '@prisma/client';
import type { ProductRepo } from '../../application/ports';
import { Product } from '../../domain/Product';
import { db } from './client';

const toProduct = (row: ProductRow) => new Product(row);

export const productRepo: ProductRepo = {
  findById: async (id) => {
    const row = await db.product.findUnique({ where: { id } });
    return row ? toProduct(row) : null;
  },
  findByUser: async (userId) => (await db.product.findMany({ where: { userId } })).map(toProduct),
  findAllActive: async () => (await db.product.findMany({ where: { returnedAt: null } })).map(toProduct),
  create: ({ id, movieId, userId, movieTitle, rentedAt, returnedAt, dias }) => (
    db.product.create({ data: { id, movieId, userId, movieTitle, rentedAt, returnedAt, dias } })
  ),
  update: ({ id, returnedAt }) => db.product.update({ where: { id }, data: { returnedAt } }),
};
