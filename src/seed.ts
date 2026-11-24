import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { db } from './infrastructure/db/client';
import { passwordHasher } from './infrastructure/security/passwordHasher';

interface Catalog {
  genres: { name: string; price: number }[];
  movies: { movieTitle: string; desc: string; genres: string[] }[];
}

const { genres, movies }: Catalog = JSON.parse(readFileSync(join(__dirname, '../prisma/data/catalog.json'), 'utf8'));

// Catálogo ficticio. Se puede ejecutar varias veces sin duplicar nada.
async function seedCatalog() {
  for (const { name, price } of genres) {
    await db.genre.upsert({ where: { name }, update: {}, create: { id: randomUUID(), name, price } });
  }
  for (const { genres: names, ...movie } of movies) {
    if (await db.movie.findFirst({ where: { movieTitle: movie.movieTitle } })) continue;
    await db.movie.create({
      data: { id: randomUUID(), ...movie, genres: { connect: names.map((name) => ({ name })) } },
    });
  }
}

async function seedAdmin() {
  const { ADMIN_EMAIL: email, ADMIN_PASSWORD: password } = process.env;
  if (!email || !password) {
    console.log('Sin ADMIN_EMAIL y ADMIN_PASSWORD: no se crea administrador');
    return;
  }
  await db.user.upsert({
    where: { email: email.toLowerCase() },
    update: {},
    create: {
      id: randomUUID(), firstName: 'Admin', lastName: 'CineRent', dni: '00000000A', phone: '000000000',
      address: 'Admin', cardLast4: '0000', email: email.toLowerCase(), passwordHash: await passwordHasher.hash(password),
      isEmailVerified: true, role: 'ADMIN',
    },
  });
}

seedCatalog()
  .then(seedAdmin)
  .then(() => console.log('Datos de ejemplo cargados'))
  .catch((error: unknown) => { console.error(error); process.exitCode = 1; })
  .finally(() => db.$disconnect());
