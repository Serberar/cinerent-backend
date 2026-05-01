const { Router } = require('express');
const listUsers = require('../../../application/use-cases/user/listUsers');
const getUserDetail = require('../../../application/use-cases/user/getUserDetail');
const suspendUser = require('../../../application/use-cases/user/suspendUser');
const updateUserAdmin = require('../../../application/use-cases/user/updateUserAdmin');
const resetUserPassword = require('../../../application/use-cases/user/resetUserPassword');
const productRepo = require('../../db/productRepo');
const movieRepo = require('../../db/movieRepo');
const authMiddleware = require('../authMiddleware');
const adminMiddleware = require('../adminMiddleware');

const fail = (err, res) => res.status(err.status || 500).json({ error: err.message });

const router = Router();

router.get('/all-movies', authMiddleware, adminMiddleware, async (req, res) => {
    try { return res.status(200).json(await movieRepo.findAllAdmin()); }
    catch (err) { return fail(err, res); }
});

router.get('/alquileres', authMiddleware, adminMiddleware, async (req, res) => {
    try { return res.status(200).json(await productRepo.findAllActive()); }
    catch (err) { return fail(err, res); }
});

router.get('/lista-de-usuarios', authMiddleware, adminMiddleware, async (req, res) => {
    try { return res.status(200).json(await listUsers()); }
    catch (err) { return fail(err, res); }
});


router.patch('/:id/suspend', authMiddleware, adminMiddleware, async (req, res) => {
    const { note } = req.body ?? {};
    try { return res.status(200).json(await suspendUser({ userId: req.params.id, note })); }
    catch (err) { return fail(err, res); }
});

router.get('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try { return res.status(200).json(await getUserDetail({ userId: req.params.id })); }
    catch (err) { return fail(err, res); }
});

router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { firstName, lastName, phone, address } = req.body ?? {};
    try { return res.status(200).json(await updateUserAdmin({ userId: req.params.id, firstName, lastName, phone, address })); }
    catch (err) { return fail(err, res); }
});

router.patch('/:id/password', authMiddleware, adminMiddleware, async (req, res) => {
    const { newPassword } = req.body ?? {};
    try { return res.json(await resetUserPassword({ userId: req.params.id, newPassword })); }
    catch (err) { return fail(err, res); }
});

module.exports = router;