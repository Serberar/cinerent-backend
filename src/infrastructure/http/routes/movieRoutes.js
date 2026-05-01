const { Router } = require('express');
const createMovie = require('../../../application/use-cases/movie/createMovie');
const listMovies = require('../../../application/use-cases/movie/listMovies');
const updateMovie = require('../../../application/use-cases/movie/updateMovie');
const toggleMovie = require('../../../application/use-cases/movie/toggleMovie');
const getFeaturedMovies = require('../../../application/use-cases/movie/getFeaturedMovies');
const toggleFeaturedMovie = require('../../../application/use-cases/movie/toggleFeaturedMovie');
const authMiddleware = require('../authMiddleware');
const adminMiddleware = require('../adminMiddleware');

const fail = (err, res) => res.status(err.status || 500).json({ error: err.message });

const router = Router();

router.post('/create-a-new-movie', authMiddleware, adminMiddleware, async (req, res) => {
    const { movieTitle, desc, year, posterUrl, director, actors, runtime, genreIds } = req.body ?? {};
    if (!movieTitle || !desc)
        return res.status(400).json({ error: 'El título y la descripción son requeridos' });
    try { return res.status(201).json(await createMovie({ movieTitle, desc, year, posterUrl, director, actors, runtime, genreIds })); }
    catch (err) { return fail(err, res); }
});

router.get('/all-movies', async (req, res) => {
    try { return res.status(200).json(await listMovies()); }
    catch (err) { return fail(err, res); }
});

router.get('/featured', async (req, res) => {
    try { return res.status(200).json(await getFeaturedMovies()); }
    catch (err) { return fail(err, res); }
});

router.patch('/:id/toggle', authMiddleware, adminMiddleware, async (req, res) => {
    try { return res.status(200).json(await toggleMovie({ id: req.params.id })); }
    catch (err) { return fail(err, res); }
});

router.patch('/:id/toggle-featured', authMiddleware, adminMiddleware, async (req, res) => {
    try { return res.status(200).json(await toggleFeaturedMovie({ id: req.params.id })); }
    catch (err) { return fail(err, res); }
});

router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { movieTitle, desc, year, posterUrl, director, actors, runtime, genreIds } = req.body ?? {};
    try { return res.status(200).json(await updateMovie({ id: req.params.id, movieTitle, desc, year, posterUrl, director, actors, runtime, genreIds })); }
    catch (err) { return fail(err, res); }
});

module.exports = router;