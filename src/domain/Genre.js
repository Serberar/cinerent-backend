const crypto = require('crypto');

class Genre {
    constructor({ id, name, price = 2.00 }) {
        this.id    = id;
        this.name  = name;
        this.price = price;
    }
    static create({ name, price = 2.00 }) {
        if (!name?.trim()) throw Object.assign(new Error('El nombre del género es requerido'), { status: 400 });
        if (isNaN(price) || price < 0) throw Object.assign(new Error('El precio debe ser un número positivo'), { status: 400 });
        return new Genre({ id: crypto.randomUUID(), name: name.trim(), price: Number(price) });
    }
    update({ name, price }) {
        if (name !== undefined) {
            if (!name?.trim()) throw Object.assign(new Error('El nombre del género es requerido'), { status: 400 });
            this.name = name.trim();
        }
        if (price !== undefined) {
            if (isNaN(price) || price < 0) throw Object.assign(new Error('El precio debe ser un número positivo'), { status: 400 });
            this.price = Number(price);
        }
    }
}

module.exports = { Genre };
