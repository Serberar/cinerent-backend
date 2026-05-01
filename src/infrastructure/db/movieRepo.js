const { db } = require('./client');
const { Movie } = require('../../domain/Movie');

const GENRE_INCLUDE = { include: { genres: { select: { id: true, name: true, price: true } } } };

const toMovie = (r) => new Movie({ ...r, genres: r.genres ?? [] });

module.exports = {
    findById: (id) =>
        db.movie.findUnique({ where: { id }, ...GENRE_INCLUDE }).then(r => r ? toMovie(r) : null),

    findAll: () =>
        db.movie.findMany({ where: { active: true }, ...GENRE_INCLUDE }).then(rows => rows.map(toMovie)),

    findAllAdmin: () =>
        db.movie.findMany({ ...GENRE_INCLUDE }).then(rows => rows.map(toMovie)),

    create: (movie, genreIds = []) => db.movie.create({
        data: {
            id: movie.id, movieTitle: movie.movieTitle, desc: movie.desc,
            year: movie.year, posterUrl: movie.posterUrl,
            director: movie.director, actors: movie.actors,
            runtime: movie.runtime, active: movie.active ?? true,
            genres: { connect: genreIds.map(id => ({ id })) },
        },
        ...GENRE_INCLUDE,
    }).then(toMovie),

    update: (movie, genreIds) => db.movie.update({
        where: { id: movie.id },
        data: {
            movieTitle: movie.movieTitle, desc: movie.desc, year: movie.year,
            posterUrl: movie.posterUrl, director: movie.director,
            actors: movie.actors, runtime: movie.runtime,
            ...(genreIds !== undefined && { genres: { set: genreIds.map(id => ({ id })) } }),
        },
        ...GENRE_INCLUDE,
    }).then(toMovie),

    toggle: (movie) => db.movie.update({
        where: { id: movie.id },
        data: { active: movie.active },
    }),

    findFeatured: () =>
        db.movie.findMany({ where: { featured: true, active: true }, ...GENRE_INCLUDE }).then(rows => rows.map(toMovie)),

    toggleFeatured: (movie) => db.movie.update({
        where: { id: movie.id },
        data: { featured: movie.featured },
        ...GENRE_INCLUDE,
    }).then(toMovie),
};
