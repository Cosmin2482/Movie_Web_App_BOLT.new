import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie, Review } from '../../models/movie.model';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="reviews-container">
      <div class="page-header">
        <h1>Movie Reviews</h1>
        <p>Discover what our community thinks about the latest movies</p>
      </div>

      <div class="reviews-content">
        <!-- Featured Reviews -->
        <section class="featured-reviews">
          <h2>Featured Reviews</h2>
          <div class="featured-grid">
            <div *ngFor="let item of featuredReviews" class="featured-review-card">
              <div class="movie-info">
                <img [src]="item.movie.poster" [alt]="item.movie.title" class="movie-poster-small" />
                <div class="movie-details">
                  <h3 class="movie-title" [routerLink]="['/movies', item.movie.id]">{{ item.movie.title }}</h3>
                  <div class="movie-meta">
                    <span class="movie-year">{{ item.movie.year }}</span>
                    <span class="separator">•</span>
                    <div class="movie-rating">
                      <span class="rating-star">⭐</span>
                      <span>{{ item.movie.rating.toFixed(1) }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="review-content">
                <div class="review-header">
                  <div class="reviewer-info">
                    <span class="reviewer-name">{{ item.review.userName }}</span>
                    <span class="review-date">{{ formatDate(item.review.date) }}</span>
                  </div>
                  <div class="user-rating">
                    <span class="rating-stars">{{ getStars(item.review.rating) }}</span>
                    <span class="rating-number">{{ item.review.rating }}/10</span>
                  </div>
                </div>
                
                <p class="review-text">{{ item.review.comment }}</p>
                
                <div class="review-actions">
                  <button class="helpful-btn">
                    👍 Helpful ({{ item.review.helpful }})
                  </button>
                  <a [routerLink]="['/movies', item.movie.id]" class="read-more-btn">
                    Read More Reviews
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Review Stats -->
        <section class="review-stats">
          <h2>Review Statistics</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-number">{{ totalReviews }}</div>
              <div class="stat-label">Total Reviews</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">⭐</div>
              <div class="stat-number">{{ averageRating.toFixed(1) }}</div>
              <div class="stat-label">Average Rating</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">🎬</div>
              <div class="stat-number">{{ moviesWithReviews }}</div>
              <div class="stat-label">Movies Reviewed</div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-number">{{ activeReviewers }}</div>
              <div class="stat-label">Active Reviewers</div>
            </div>
          </div>
        </section>

        <!-- Top Rated Movies -->
        <section class="top-rated-section">
          <h2>Highest Rated Movies</h2>
          <div class="top-rated-list">
            <div *ngFor="let movie of topRatedMovies; let i = index" class="top-rated-item">
              <div class="rank-badge">{{ i + 1 }}</div>
              <img [src]="movie.poster" [alt]="movie.title" class="movie-poster-tiny" />
              <div class="movie-info-compact">
                <h4 class="movie-title-compact" [routerLink]="['/movies', movie.id]">{{ movie.title }}</h4>
                <div class="movie-meta-compact">
                  <span class="movie-year">{{ movie.year }}</span>
                  <div class="rating-info">
                    <span class="rating-star">⭐</span>
                    <span class="rating-value">{{ movie.rating.toFixed(1) }}</span>
                    <span class="reviews-count">({{ movie.totalReviews }} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Call to Action -->
        <section class="cta-section">
          <div class="cta-content">
            <h2>Share Your Movie Experience</h2>
            <p>Help other movie lovers discover great films by sharing your honest reviews and ratings.</p>
            <a routerLink="/movies" class="cta-button">Browse Movies to Review</a>
          </div>
        </section>
      </div>

      <div class="loading" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>Loading reviews...</p>
      </div>
    </div>
  `,
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent implements OnInit {
  featuredReviews: { movie: Movie, review: Review }[] = [];
  topRatedMovies: Movie[] = [];
  totalReviews: number = 0;
  averageRating: number = 0;
  moviesWithReviews: number = 0;
  activeReviewers: number = 0;
  isLoading: boolean = true;

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.loadReviewsData();
  }

  private loadReviewsData() {
    // Load movies and reviews
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        this.processReviewsData(movies);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading reviews data:', error);
        this.isLoading = false;
      }
    });
  }

  private processReviewsData(movies: Movie[]) {
    // Get top rated movies
    this.topRatedMovies = movies
      .filter(movie => movie.totalReviews && movie.totalReviews > 0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);

    // Calculate stats
    this.totalReviews = movies.reduce((sum, movie) => sum + (movie.totalReviews || 0), 0);
    this.moviesWithReviews = movies.filter(movie => movie.totalReviews && movie.totalReviews > 0).length;
    this.averageRating = movies.reduce((sum, movie) => sum + movie.rating, 0) / movies.length;
    this.activeReviewers = Math.floor(this.totalReviews * 0.6); // Simulated

    // Create featured reviews (simulated)
    this.createFeaturedReviews(movies.slice(0, 3));
  }

  private createFeaturedReviews(movies: Movie[]) {
    const sampleReviews: Omit<Review, 'movieId'>[] = [
      {
        id: 1,
        userName: "CinematicExplorer",
        rating: 9,
        comment: "An absolute masterpiece that transcends the superhero genre. The psychological depth and moral complexity make this more than just entertainment—it's a profound exploration of chaos, order, and the thin line between heroism and vigilantism. Heath Ledger's performance is haunting and unforgettable.",
        date: new Date('2024-01-15'),
        helpful: 127
      },
      {
        id: 2,
        userName: "MovieMaven2024",
        rating: 8,
        comment: "A mind-bending journey through layers of dreams and reality. Nolan's intricate storytelling combined with stunning visuals creates an experience that demands multiple viewings. DiCaprio delivers another powerhouse performance in this thought-provoking sci-fi thriller.",
        date: new Date('2024-02-20'),
        helpful: 89
      },
      {
        id: 3,
        userName: "FilmCriticPro",
        rating: 9,
        comment: "A beautiful and ambitious space epic that combines hard science with emotional storytelling. The visuals are breathtaking, and the themes of love, sacrifice, and human survival resonate deeply. McConaughey and Hathaway's performances anchor this cosmic journey perfectly.",
        date: new Date('2024-01-08'),
        helpful: 156
      }
    ];

    this.featuredReviews = movies.map((movie, index) => ({
      movie,
      review: { ...sampleReviews[index], movieId: movie.id } as Review
    }));
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStars(rating: number): string {
    return '⭐'.repeat(Math.floor(rating / 2));
  }
}