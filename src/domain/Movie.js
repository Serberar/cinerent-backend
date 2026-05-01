
const crypto = require('crypto');

class Movie {
    constructor({ id, movieTitle, desc, year, posterUrl, genres, director, actors, runtime, active, featured }) {
        this.id = id;
        this.movieTitle = movieTitle;
        this.desc = desc;
        this.year = year;
        this.posterUrl = posterUrl ?? null;
        this.genres = genres ?? [];   // [{id, name}]
        this.director = director ?? null;
        this.actors = actors ?? null;
        this.runtime = runtime ?? null;
        this.active = active ?? true;
        this.featured = featured ?? false;
    }
    static create({ movieTitle, desc, year, posterUrl, genres, director, actors, runtime }) {
        if (!movieTitle || !desc) {
            throw new Error("Faltan datos por rellenar");
        }
        return new Movie({
            id: crypto.randomUUID(),
            movieTitle, desc, year,
            posterUrl, genres: genres ?? [],
            director, actors, runtime,
            active: true
        })
    }
    updateMovie({ movieTitle, desc, year, posterUrl, genres, director, actors, runtime }) {
        if (movieTitle) this.movieTitle = movieTitle;
        if (desc) this.desc = desc;
        if (year) this.year = year;
        if (posterUrl) this.posterUrl = posterUrl;
        if (genres) this.genres = genres;
        if (director) this.director = director;
        if (actors) this.actors = actors;
        if (runtime) this.runtime = runtime;
    }
    toggleActive() {
        this.active = !this.active;
    }
    toggleFeatured() {
        this.featured = !this.featured;
    }
}

module.exports = { Movie }