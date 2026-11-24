const crypto = require('crypto');
const { badRequest } = require('./errors');

class Genre {
    constructor({ id, name, price = 2.00 }) {
        this.id    = id;
        this.name  = name;
        this.price = price;
    }
    static create({ name, price = 2.00 }) {
        if (!name?.trim()) throw badRequest('El nombre del género es requerido');
        if (isNaN(price) || price < 0) throw badRequest('El precio debe ser un número positivo');
        return new Genre({ id: crypto.randomUUID(), name: name.trim(), price: Number(price) });
    }
    update({ name, price }) {
        if (name !== undefined) {
            if (!name?.trim()) throw badRequest('El nombre del género es requerido');
            this.name = name.trim();
        }
        if (price !== undefined) {
            if (isNaN(price) || price < 0) throw badRequest('El precio debe ser un número positivo');
            this.price = Number(price);
        }
    }
}

module.exports = { Genre };
