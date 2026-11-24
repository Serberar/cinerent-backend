const crypto = require('crypto');
const { badRequest } = require('./errors');

const CARD_DIGITS = /^\d{16}$/;

// Solo se conservan los cuatro últimos dígitos: el número completo nunca se guarda
function cardLast4From(cardNumber) {
  const digits = String(cardNumber ?? '').replace(/\s/g, '');
  if (!CARD_DIGITS.test(digits)) throw badRequest('El número de tarjeta debe tener 16 dígitos');
  return digits.slice(-4);
}

class User {
  constructor({ id, role = 'USER', firstName, lastName, dni, phone, address, cardLast4, email, passwordHash,
    isEmailVerified = false, emailVerificationToken = null,
    emailVerificationTokenExpiresAt = null, createdAt = new Date(), updatedAt = new Date(),
    suspended = false, suspensionNote = null }) {
    this.id = id;
    this.role = role;
    this.firstName = firstName;
    this.lastName = lastName;
    this.dni = dni;
    this.phone = phone;
    this.address = address;
    this.cardLast4 = cardLast4;
    this.email = email;
    this.passwordHash = passwordHash;
    this.isEmailVerified = isEmailVerified;
    this.emailVerificationToken = emailVerificationToken;
    this.emailVerificationTokenExpiresAt = emailVerificationTokenExpiresAt;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.suspended = suspended;
    this.suspensionNote = suspensionNote;
  }

  static create({ firstName, lastName, dni, phone, address, cardNumber, email, passwordHash }) {
    return new User({
      id: crypto.randomUUID(),
      firstName, lastName, dni, phone, address,
      cardLast4: cardLast4From(cardNumber),
      email: email.toLowerCase().trim(),
      passwordHash,
      emailVerificationToken: crypto.randomBytes(32).toString('hex'),
      emailVerificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
  }

  verifyEmail() {
    this.isEmailVerified = true;
    this.emailVerificationToken = null;
    this.emailVerificationTokenExpiresAt = null;
    this.updatedAt = new Date();
  }

  isVerificationTokenExpired() {
    return !this.emailVerificationTokenExpiresAt || new Date() > this.emailVerificationTokenExpiresAt;
  }

  updateProfile({ firstName, lastName, phone, address }) {
    if (firstName) this.firstName = firstName;
    if (lastName) this.lastName = lastName;
    if (phone) this.phone = phone;
    if (address) this.address = address;
    this.updatedAt = new Date();
  }

  updateCard(cardNumber) {
    this.cardLast4 = cardLast4From(cardNumber);
    this.updatedAt = new Date();
  }

  suspend(note) {
    this.suspended = true;
    this.suspensionNote = note || null;
    this.updatedAt = new Date();
  }

  unsuspend() {
    this.suspended = false;
    this.suspensionNote = null;
    this.updatedAt = new Date();
  }
}

module.exports = { User };
