const { Router } = require('express');
const listGenres = require('../../../application/use-cases/genre/listGenres');
const createGenre = require('../../../application/use-cases/genre/createGenre');
const updateGenre = require('../../../application/use-cases/genre/updateGenre');
const deleteGenre = require('../../../application/use-cases/genre/deleteGenre');
const authMiddleware = require('../authMiddleware');
const adminMiddleware = require('../adminMiddleware');

const fail = (err, res) => res.status(err.status || 500).json({ error: err.message });
const router = Router();

router.get('/', async (req, res) => {
    try { return res.json(await listGenres()); }
    catch (err) { return fail(err, res); }
});

router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    const { name, price } = req.body ?? {};
    if (!name) return res.status(400).json({ error: 'El nombre es requerido' });
    try { return res.status(201).json(await createGenre({ name, price })); }
    catch (err) { return fail(err, res); }
});

router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { name, price } = req.body ?? {};
    try { return res.json(await updateGenre({ id: req.params.id, name, price })); }
    catch (err) { return fail(err, res); }
});

router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try { return res.json(await deleteGenre({ id: req.params.id })); }
    catch (err) { return fail(err, res); }
});

module.exports = router;
