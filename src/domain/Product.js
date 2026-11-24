const crypto = require('crypto');
const { badRequest } = require('./errors');

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_DAYS = 30;

class Product {
    constructor({ id, movieId, userId, movieTitle, dias, rentedAt = new Date(),
        returnedAt = null }) {
        this.id = id;
        this.movieId = movieId;
        this.userId = userId;
        this.movieTitle = movieTitle;
        this.dias = dias;
        this.rentedAt = rentedAt;
        this.returnedAt = returnedAt;
    }

    static create({ userId, movieId, movieTitle, dias}) {
        if (!userId || !movieId || !movieTitle) {
            throw badRequest('Faltan datos por rellenar');
        }
        if (!Number.isInteger(dias) || dias < 1 || dias > MAX_DAYS) {
            throw badRequest(`Los días deben ser un número entre 1 y ${MAX_DAYS}`);
        }
        return new Product({
            id: crypto.randomUUID(),
            userId,
            movieId,
            movieTitle,
            dias,
            returnedAt: null
        })
    }

    belongsTo(userId) {
        return this.userId === userId;
    }

    total(pricePerDay) {
        return Math.round(this.dias * pricePerDay * 100) / 100;
    }

    isExpired(now = new Date()) {
        return new Date(this.rentedAt).getTime() + this.dias * DAY_MS <= now.getTime();
    }

    isActive() {
        return this.returnedAt === null;
    }

    markAsReturned() {
        if (!this.isActive()) return
        this.returnedAt = new Date();
    }
}

module.exports = { Product };
