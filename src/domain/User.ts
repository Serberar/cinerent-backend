import { randomBytes, randomUUID } from 'node:crypto';
import { badRequest } from './errors';

const CARD_DIGITS = /^\d{16}$/;
const VERIFICATION_MS = 24 * 60 * 60 * 1000;

export type Role = 'USER' | 'ADMIN';

export interface Profile {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
}

export interface NewUser extends Profile {
  dni: string;
  cardNumber: string;
  email: string;
  passwordHash: string;
}

export interface UserProps extends Profile {
  id: string;
  role?: Role;
  dni: string;
  cardLast4: string;
  email: string;
  passwordHash: string;
  isEmailVerified?: boolean;
  emailVerificationToken?: string | null;
  emailVerificationTokenExpiresAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  suspended?: boolean;
  suspensionNote?: string | null;
}

// Solo se conservan los cuatro últimos dígitos: el número completo nunca se guarda
function cardLast4From(cardNumber: string): string {
  const digits = String(cardNumber ?? '').replace(/\s/g, '');
  if (!CARD_DIGITS.test(digits)) throw badRequest('El número de tarjeta debe tener 16 dígitos');
  return digits.slice(-4);
}

export class User {
  readonly id: string;
  role: Role;
  firstName: string;
  lastName: string;
  readonly dni: string;
  phone: string;
  address: string;
  cardLast4: string;
  readonly email: string;
  passwordHash: string;
  isEmailVerified: boolean;
  emailVerificationToken: string | null;
  emailVerificationTokenExpiresAt: Date | null;
  readonly createdAt: Date;
  updatedAt: Date;
  suspended: boolean;
  suspensionNote: string | null;

  constructor(props: UserProps) {
    this.id = props.id;
    this.role = props.role ?? 'USER';
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.dni = props.dni;
    this.phone = props.phone;
    this.address = props.address;
    this.cardLast4 = props.cardLast4;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.isEmailVerified = props.isEmailVerified ?? false;
    this.emailVerificationToken = props.emailVerificationToken ?? null;
    this.emailVerificationTokenExpiresAt = props.emailVerificationTokenExpiresAt ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
    this.suspended = props.suspended ?? false;
    this.suspensionNote = props.suspensionNote ?? null;
  }

  static create({ cardNumber, email, ...data }: NewUser): User {
    return new User({
      ...data,
      id: randomUUID(),
      cardLast4: cardLast4From(cardNumber),
      email: email.toLowerCase().trim(),
      emailVerificationToken: randomBytes(32).toString('hex'),
      emailVerificationTokenExpiresAt: new Date(Date.now() + VERIFICATION_MS),
    });
  }

  verifyEmail(): void {
    this.isEmailVerified = true;
    this.emailVerificationToken = null;
    this.emailVerificationTokenExpiresAt = null;
    this.updatedAt = new Date();
  }

  isVerificationTokenExpired(): boolean {
    return !this.emailVerificationTokenExpiresAt || new Date() > this.emailVerificationTokenExpiresAt;
  }

  updateProfile({ firstName, lastName, phone, address }: Partial<Profile>): void {
    if (firstName) this.firstName = firstName;
    if (lastName) this.lastName = lastName;
    if (phone) this.phone = phone;
    if (address) this.address = address;
    this.updatedAt = new Date();
  }

  updateCard(cardNumber: string): void {
    this.cardLast4 = cardLast4From(cardNumber);
    this.updatedAt = new Date();
  }

  suspend(note?: string): void {
    this.suspended = true;
    this.suspensionNote = note || null;
    this.updatedAt = new Date();
  }

  unsuspend(): void {
    this.suspended = false;
    this.suspensionNote = null;
    this.updatedAt = new Date();
  }
}
