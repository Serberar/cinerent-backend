// Lo que la aplicación necesita de fuera. La infraestructura lo implementa; la aplicación solo conoce estos tipos.
import type { Genre } from '../domain/Genre';
import type { Movie } from '../domain/Movie';
import type { Product } from '../domain/Product';
import type { User } from '../domain/User';

export interface UserRepo {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByVerificationToken(token: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  create(user: User): Promise<unknown>;
  update(user: User): Promise<unknown>;
  updateProfile(user: User): Promise<unknown>;
  updateCard(user: User): Promise<unknown>;
  updateSuspension(user: User): Promise<unknown>;
  updatePassword(data: { id: string; passwordHash: string }): Promise<unknown>;
}

export interface ProductRepo {
  findById(id: string): Promise<Product | null>;
  findByUser(userId: string): Promise<Product[]>;
  findAllActive(): Promise<Product[]>;
  create(product: Product): Promise<unknown>;
  update(product: Product): Promise<unknown>;
}

export interface MovieRepo {
  findById(id: string): Promise<Movie | null>;
  findAll(): Promise<Movie[]>;
  findAllAdmin(): Promise<Movie[]>;
  findFeatured(): Promise<Movie[]>;
  create(movie: Movie, genreIds: string[]): Promise<Movie>;
  update(movie: Movie, genreIds?: string[]): Promise<Movie>;
  toggle(movie: Movie): Promise<unknown>;
  toggleFeatured(movie: Movie): Promise<Movie>;
}

export interface GenreRepo {
  findAll(): Promise<Genre[]>;
  findById(id: string): Promise<Genre | null>;
  findByName(name: string): Promise<Genre | null>;
  create(genre: Genre): Promise<Genre>;
  update(genre: Genre): Promise<Genre>;
  delete(id: string): Promise<unknown>;
}

export interface PasswordHasher {
  hash(password: string): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}

export interface TokenService {
  sign(userId: string): string;
  verify(token: string): string;
}

export interface EmailTemplates {
  verifyEmail: { url: string };
  rentConfirmation: { movieTitle: string; dias: number; total: number };
  returnConfirmation: { movieTitle: string; returnedAt: string };
}

export interface EmailSender {
  send<T extends keyof EmailTemplates>(to: string, template: T, data: EmailTemplates[T]): Promise<void>;
}

export interface Logger {
  error(...args: unknown[]): void;
}

export interface Deps {
  userRepo: UserRepo;
  productRepo: ProductRepo;
  movieRepo: MovieRepo;
  genreRepo: GenreRepo;
  passwordHasher: PasswordHasher;
  tokenService: TokenService;
  emailSender: EmailSender;
  frontendUrl: string;
  logger: Logger;
}
