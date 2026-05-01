const { db }     = require('./client');
const { Genre }  = require('../../domain/Genre');

const toGenre = (r) => new Genre(r);

module.exports = {
    findAll: () => db.genre.findMany({ orderBy: { name: 'asc' } }).then(rows => rows.map(toGenre)),
    findById: (id) => db.genre.findUnique({ where: { id } }).then(r => r ? toGenre(r) : null),
    findByName: (name) => db.genre.findUnique({ where: { name } }).then(r => r ? toGenre(r) : null),

    create: (genre) => db.genre.create({ data: { id: genre.id, name: genre.name, price: genre.price } }).then(toGenre),

    update: (genre) => db.genre.update({
        where: { id: genre.id },
        data:  { name: genre.name, price: genre.price },
    }).then(toGenre),

    delete: (id) => db.genre.delete({ where: { id } }),
};
