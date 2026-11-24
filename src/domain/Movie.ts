import { randomUUID } from 'node:crypto';
import { badRequest } from './errors';

const DEFAULT_PRICE = 2;

export interface MovieGenre {
  id: string;
  name: string;
  price?: number;
}

export interface MovieData {
  movieTitle: string;
  desc: string;
  year?: number | null;
  posterUrl?: string | null;
  genres?: MovieGenre[];
  director?: string | null;
  actors?: string | null;
  runtime?: string | null;
}

export interface MovieProps extends MovieData {
  id: string;
  active?: boolean;
  featured?: boolean;
}

export class Movie {
  readonly id: string;
  movieTitle: string;
  desc: string;
  year: number | null;
  posterUrl: string | null;
  genres: MovieGenre[];
  director: string | null;
  actors: string | null;
  runtime: string | null;
  active: boolean;
  featured: boolean;

  constructor(props: MovieProps) {
    this.id = props.id;
    this.movieTitle = props.movieTitle;
    this.desc = props.desc;
    this.year = props.year ?? null;
    this.posterUrl = props.posterUrl ?? null;
    this.genres = props.genres ?? [];
    this.director = props.director ?? null;
    this.actors = props.actors ?? null;
    this.runtime = props.runtime ?? null;
    this.active = props.active ?? true;
    this.featured = props.featured ?? false;
  }

  static create(data: MovieData): Movie {
    if (!data.movieTitle || !data.desc) throw badRequest('Faltan datos por rellenar');
    return new Movie({ ...data, id: randomUUID(), active: true });
  }

  updateMovie(data: Partial<MovieData>): void {
    if (data.movieTitle) this.movieTitle = data.movieTitle;
    if (data.desc) this.desc = data.desc;
    if (data.year) this.year = data.year;
    if (data.posterUrl) this.posterUrl = data.posterUrl;
    if (data.genres) this.genres = data.genres;
    if (data.director) this.director = data.director;
    if (data.actors) this.actors = data.actors;
    if (data.runtime) this.runtime = data.runtime;
  }

  // El día cuesta lo que el género más caro de la película
  pricePerDay(): number {
    const prices = this.genres.map((genre) => genre.price ?? DEFAULT_PRICE);
    return prices.length ? Math.max(...prices) : DEFAULT_PRICE;
  }

  toggleActive(): void {
    this.active = !this.active;
  }

  toggleFeatured(): void {
    this.featured = !this.featured;
  }
}
