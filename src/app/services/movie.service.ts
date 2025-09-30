import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { Movie, Review, MovieFilter } from '../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private moviesSubject = new BehaviorSubject<Movie[]>([]);
  public movies$ = this.moviesSubject.asObservable();

  private mockMovies: Movie[] = [
    {
      id: 1,
      title: "The Dark Knight",
      poster: "https://images.unsplash.com/photo-1509347528160-9329fb5dfd34?w=400",
      backdrop: "https://images.unsplash.com/photo-1489599732735-3b2ad80b3b5b?w=800",
      year: 2008,
      genre: ["Action", "Crime", "Drama"],
      rating: 9.0,
      description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
      duration: 152,
      director: "Christopher Nolan",
      cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
      averageRating: 8.8,
      totalReviews: 1250
    },
    {
      id: 2,
      title: "Inception",
      poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400",
      backdrop: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=800",
      year: 2010,
      genre: ["Action", "Sci-Fi", "Thriller"],
      rating: 8.8,
      description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      duration: 148,
      director: "Christopher Nolan",
      cast: ["Leonardo DiCaprio", "Marion Cotillard", "Tom Hardy"],
      averageRating: 8.7,
      totalReviews: 980
    },
    {
      id: 3,
      title: "Interstellar",
      poster: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400",
      backdrop: "https://images.unsplash.com/photo-1446776776237-74351c96b21a?w=800",
      year: 2014,
      genre: ["Adventure", "Drama", "Sci-Fi"],
      rating: 8.6,
      description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      duration: 169,
      director: "Christopher Nolan",
      cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"],
      averageRating: 8.5,
      totalReviews: 876
    },
    {
      id: 4,
      title: "The Matrix",
      poster: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400",
      backdrop: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800",
      year: 1999,
      genre: ["Action", "Sci-Fi"],
      rating: 8.7,
      description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
      duration: 136,
      director: "Lana Wachowski, Lilly Wachowski",
      cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss"],
      averageRating: 8.6,
      totalReviews: 1100
    },
    {
      id: 5,
      title: "Pulp Fiction",
      poster: "https://images.unsplash.com/photo-1489599732735-3b2ad80b3b5b?w=400",
      backdrop: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800",
      year: 1994,
      genre: ["Crime", "Drama"],
      rating: 8.9,
      description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
      duration: 154,
      director: "Quentin Tarantino",
      cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
      averageRating: 8.8,
      totalReviews: 1340
    },
    {
      id: 6,
      title: "Avatar",
      poster: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=400",
      backdrop: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800",
      year: 2009,
      genre: ["Action", "Adventure", "Fantasy"],
      rating: 7.8,
      description: "A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.",
      duration: 162,
      director: "James Cameron",
      cast: ["Sam Worthington", "Zoe Saldana", "Sigourney Weaver"],
      averageRating: 7.9,
      totalReviews: 2100
    }
  ];

  private mockReviews: Review[] = [
    {
      id: 1,
      movieId: 1,
      userName: "MovieBuff2024",
      rating: 9,
      comment: "Absolutely incredible performance by Heath Ledger. This movie redefined what a superhero film could be.",
      date: new Date('2024-01-15'),
      helpful: 45
    },
    {
      id: 2,
      movieId: 1,
      userName: "CinemaLover",
      rating: 8,
      comment: "Dark, gritty, and perfectly executed. Nolan's direction is masterful.",
      date: new Date('2024-02-10'),
      helpful: 32
    },
    {
      id: 3,
      movieId: 2,
      userName: "SciFiFan",
      rating: 9,
      comment: "Mind-bending concept executed flawlessly. DiCaprio's performance is outstanding.",
      date: new Date('2024-01-20'),
      helpful: 28
    }
  ];

  constructor() {
    this.moviesSubject.next(this.mockMovies);
  }

  getMovies(filter?: MovieFilter): Observable<Movie[]> {
    let filteredMovies = [...this.mockMovies];

    if (filter) {
      if (filter.searchTerm) {
        const searchTerm = filter.searchTerm.toLowerCase();
        filteredMovies = filteredMovies.filter(movie => 
          movie.title.toLowerCase().includes(searchTerm) ||
          movie.description.toLowerCase().includes(searchTerm) ||
          movie.director.toLowerCase().includes(searchTerm) ||
          movie.cast.some(actor => actor.toLowerCase().includes(searchTerm))
        );
      }

      if (filter.genre) {
        filteredMovies = filteredMovies.filter(movie => 
          movie.genre.includes(filter.genre!)
        );
      }

      if (filter.year) {
        filteredMovies = filteredMovies.filter(movie => movie.year === filter.year);
      }

      if (filter.rating) {
        filteredMovies = filteredMovies.filter(movie => movie.rating >= filter.rating!);
      }
    }

    return of(filteredMovies);
  }

  getMovieById(id: number): Observable<Movie | undefined> {
    const movie = this.mockMovies.find(m => m.id === id);
    return of(movie);
  }

  getPopularMovies(): Observable<Movie[]> {
    const popularMovies = this.mockMovies
      .sort((a, b) => (b.totalReviews || 0) - (a.totalReviews || 0))
      .slice(0, 6);
    return of(popularMovies);
  }

  getRecommendedMovies(movieId: number): Observable<Movie[]> {
    const currentMovie = this.mockMovies.find(m => m.id === movieId);
    if (!currentMovie) return of([]);

    const recommended = this.mockMovies
      .filter(m => m.id !== movieId)
      .filter(m => m.genre.some(g => currentMovie.genre.includes(g)))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 4);

    return of(recommended);
  }

  getMovieReviews(movieId: number): Observable<Review[]> {
    const reviews = this.mockReviews.filter(r => r.movieId === movieId);
    return of(reviews);
  }

  addReview(review: Omit<Review, 'id' | 'date' | 'helpful'>): Observable<Review> {
    const newReview: Review = {
      ...review,
      id: Date.now(),
      date: new Date(),
      helpful: 0
    };
    
    this.mockReviews.push(newReview);
    return of(newReview);
  }

  getGenres(): Observable<string[]> {
    const allGenres = this.mockMovies.flatMap(movie => movie.genre);
    const uniqueGenres = [...new Set(allGenres)].sort();
    return of(uniqueGenres);
  }
}