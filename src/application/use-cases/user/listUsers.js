const userRepo = require('../../../infrastructure/db/userRepo');

module.exports = async function listUsers() {
    const all = await userRepo.findAll();
    const users = all.filter(u => u.role !== 'ADMIN');
    return { users: users.map(u => ({
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
    suspended: u.suspended,
    suspensionNote: u.suspensionNote
    }))};
}