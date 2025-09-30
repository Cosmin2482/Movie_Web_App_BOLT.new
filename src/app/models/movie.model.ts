export interface Movie {
  id: number;
  title: string;
  poster: string;
  backdrop?: string;
  year: number;
  genre: string[];
  rating: number;
  description: string;
  duration: number;
  director: string;
  cast: string[];
  reviews?: Review[];
  averageRating?: number;
  totalReviews?: number;
}

export interface Review {
  id: number;
  movieId: number;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
  helpful: number;
}

export interface MovieFilter {
  genre?: string;
  year?: number;
  rating?: number;
  searchTerm?: string;
}