require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt  = require('bcryptjs');
const crypto  = require('crypto');
const fs      = require('fs');
const path    = require('path');

const db = new PrismaClient();

const GENRE_ES = {
    Action:      'Acción',
    Adventure:   'Aventura',
    Animation:   'Animación',
    Biography:   'Biografía',
    Comedy:      'Comedia',
    Crime:       'Crimen',
    Drama:       'Drama',
    Family:      'Familia',
    Fantasy:     'Fantasía',
    'Film-Noir': 'Cine Negro',
    History:     'Historia',
    Horror:      'Terror',
    Music:       'Música',
    Musical:     'Musical',
    Mystery:     'Misterio',
    Romance:     'Romance',
    'Sci-Fi':    'Ciencia Ficción',
    Thriller:    'Suspense',
    War:         'Guerra',
    Western:     'Western',
};

async function main() {
    // ── Películas ────────────────────────────────────────────────────────────
    const raw = fs.readFileSync(
        path.join(__dirname, '../../../videoclub-frontend/src/data/movies.js'),
        'utf8'
    );
    const jsonStr = raw.replace(/^export let movies\s*=\s*/, '').replace(/;?\s*$/, '');
    const movies  = JSON.parse(jsonStr);

    // Recopilar géneros únicos
    const genreNames = [...new Set(movies.flatMap(m => m.genres ?? []))].sort();

    // Borrar géneros en inglés que pudieran existir de seeds anteriores
    await db.genre.deleteMany({
        where: { name: { in: genreNames } }
    });

    console.log(`Creando ${genreNames.length} géneros en español...`);
    const genreMap = {};
    for (const englishName of genreNames) {
        const spanishName = GENRE_ES[englishName] || englishName;
        const genre = await db.genre.upsert({
            where:  { name: spanishName },
            update: { name: spanishName },
            create: { id: crypto.randomUUID(), name: spanishName },
        });
        genreMap[englishName] = genre.id;
    }

    console.log(`Insertando ${movies.length} películas...`);
    for (const movie of movies) {
        const genreIds = (movie.genres ?? []).map(g => ({ id: genreMap[g] })).filter(g => g.id);
        await db.movie.upsert({
            where:  { id: String(movie.id) },
            update: {
                movieTitle: movie.title,
                desc:       movie.plot,
                year:       movie.year ? parseInt(movie.year, 10) : null,
                posterUrl:  movie.posterUrl ?? null,
                director:   movie.director  ?? null,
                actors:     movie.actors    ?? null,
                runtime:    movie.runtime   ?? null,
                genres:     { set: genreIds },
            },
            create: {
                id:         String(movie.id),
                movieTitle: movie.title,
                desc:       movie.plot,
                year:       movie.year ? parseInt(movie.year, 10) : null,
                posterUrl:  movie.posterUrl ?? null,
                director:   movie.director  ?? null,
                actors:     movie.actors    ?? null,
                runtime:    movie.runtime   ?? null,
                genres:     { connect: genreIds },
            },
        });
    }
    console.log('Seed de películas completado.');

    // ── Admin ────────────────────────────────────────────────────────────────
    const adminEmail    = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (adminEmail && adminPassword) {
        const exists = await db.user.findUnique({ where: { email: adminEmail } });
        if (!exists) {
            await db.user.create({
                data: {
                    id:              crypto.randomUUID(),
                    firstName:       'Admin',
                    lastName:        'CineRent',
                    dni:             '00000000A',
                    phone:           '000000000',
                    address:         'Admin',
                    cardNumber:      '0000000000000000',
                    email:           adminEmail,
                    passwordHash:    await bcrypt.hash(adminPassword, 12),
                    isEmailVerified: true,
                    role:            'ADMIN',
                },
            });
            console.log(`Admin creado: ${adminEmail}`);
        } else {
            console.log(`Admin ya existe: ${adminEmail}`);
        }
    }

    console.log('Seed completado.');
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => db.$disconnect());
