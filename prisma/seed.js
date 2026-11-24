require('dotenv').config();
const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');
const passwordHasher = require('../src/infrastructure/security/passwordHasher');
const { genres, movies } = require('./data/catalog.json');

const db = new PrismaClient();

// Catálogo ficticio. Se puede ejecutar varias veces sin duplicar nada.
async function seedCatalog() {
  for (const { name, price } of genres) {
    await db.genre.upsert({ where: { name }, update: {}, create: { id: crypto.randomUUID(), name, price } });
  }
  for (const { genres: names, ...movie } of movies) {
    if (await db.movie.findFirst({ where: { movieTitle: movie.movieTitle } })) continue;
    await db.movie.create({
      data: { id: crypto.randomUUID(), ...movie, genres: { connect: names.map((name) => ({ name })) } },
    });
  }
}

async function seedAdmin() {
  const { ADMIN_EMAIL: email, ADMIN_PASSWORD: password } = process.env;
  if (!email || !password) return console.log('Sin ADMIN_EMAIL y ADMIN_PASSWORD: no se crea administrador');
  await db.user.upsert({
    where: { email: email.toLowerCase() },
    update: {},
    create: {
      id: crypto.randomUUID(), firstName: 'Admin', lastName: 'CineRent', dni: '00000000A', phone: '000000000',
      address: 'Admin', cardLast4: '0000', email: email.toLowerCase(), passwordHash: await passwordHasher.hash(password),
      isEmailVerified: true, role: 'ADMIN',
    },
  });
}

seedCatalog()
  .then(seedAdmin)
  .then(() => console.log('Datos de ejemplo cargados'))
  .catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(() => db.$disconnect());
