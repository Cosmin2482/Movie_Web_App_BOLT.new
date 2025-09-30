import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { Movie, Review } from '../../models/movie.model';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MovieCardComponent],
  template: `
    <div class="movie-detail-container" *ngIf="movie; else loading">
      <!-- Hero Section -->
      <div class="movie-hero" [style.background-image]="'url(' + (movie.backdrop || movie.poster) + ')'">
        <div class="hero-overlay">
          <div class="hero-content">
            <div class="movie-poster-large">
              <img [src]="movie.poster" [alt]="movie.title" />
              <div class="rating-badge-large">
                <span class="rating-star">⭐</span>
                <span class="rating-value">{{ movie.rating.toFixed(1) }}</span>
              </div>
            </div>
            
            <div class="movie-info-main">
              <h1 class="movie-title">{{ movie.title }}</h1>
              
              <div class="movie-meta-info">
                <span class="movie-year">{{ movie.year }}</span>
                <span class="separator">•</span>
                <span class="movie-duration">{{ formatDuration(movie.duration) }}</span>
                <span class="separator">•</span>
                <span class="movie-director">Dir. {{ movie.director }}</span>
              </div>
              
              <div class="movie-genres">
                <span *ngFor="let genre of movie.genre" class="genre-tag">{{ genre }}</span>
              </div>
              
              <p class="movie-description">{{ movie.description }}</p>
              
              <div class="movie-cast">
                <h3>Cast</h3>
                <div class="cast-list">
                  <span *ngFor="let actor of movie.cast; let last = last" class="cast-member">
                    {{ actor }}<span *ngIf="!last">, </span>
                  </span>
                </div>
              </div>
              
              <div class="movie-stats">
                <div class="stat">
                  <span class="stat-label">Average Rating</span>
                  <span class="stat-value">{{ movie.averageRating?.toFixed(1) || 'N/A' }}/10</span>
                </div>
                <div class="stat">
                  <span class="stat-label">Total Reviews</span>
                  <span class="stat-value">{{ movie.totalReviews || 0 }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <section class="reviews-section">
        <div class="section-header">
          <h2>User Reviews</h2>
          <button (click)="showReviewForm = !showReviewForm" class="add-review-btn">
            {{ showReviewForm ? 'Cancel' : 'Write Review' }}
          </button>
        </div>

        <!-- Review Form -->
        <div class="review-form-container" *ngIf="showReviewForm">
          <form (ngSubmit)="submitReview()" class="review-form">
            <div class="form-group">
              <label for="userName">Your Name</label>
              <input 
                type="text" 
                id="userName"
                [(ngModel)]="newReview.userName"
                name="userName"
                required
                class="form-input">
            </div>
            
            <div class="form-group">
              <label for="rating">Rating</label>
              <select 
                id="rating"
                [(ngModel)]="newReview.rating"
                name="rating"
                required
                class="form-select">
                <option value="">Select Rating</option>
                <option *ngFor="let i of [1,2,3,4,5,6,7,8,9,10]" [value]="i">
                  {{ i }}/10
                </option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="comment">Review</label>
              <textarea 
                id="comment"
                [(ngModel)]="newReview.comment"
                name="comment"
                required
                rows="4"
                placeholder="Share your thoughts about this movie..."
                class="form-textarea"></textarea>
            </div>
            
            <button type="submit" class="submit-btn" [disabled]="isSubmittingReview">
              {{ isSubmittingReview ? 'Submitting...' : 'Submit Review' }}
            </button>
          </form>
        </div>

        <!-- Reviews List -->
        <div class="reviews-list" *ngIf="reviews.length > 0; else noReviews">
          <div *ngFor="let review of reviews" class="review-item">
            <div class="review-header">
              <div class="reviewer-info">
                <span class="reviewer-name">{{ review.userName }}</span>
                <span class="review-date">{{ formatDate(review.date) }}</span>
              </div>
              <div class="review-rating">
                <span class="rating-stars">{{ getStars(review.rating) }}</span>
                <span class="rating-number">{{ review.rating }}/10</span>
              </div>
            </div>
            <p class="review-comment">{{ review.comment }}</p>
            <div class="review-actions">
              <button class="helpful-btn">
                👍 Helpful ({{ review.helpful }})
              </button>
            </div>
          </div>
        </div>

        <ng-template #noReviews>
          <div class="no-reviews">
            <p>No reviews yet. Be the first to review this movie!</p>
          </div>
        </ng-template>
      </section>

      <!-- Recommendations Section -->
      <section class="recommendations-section" *ngIf="recommendedMovies.length > 0">
        <div class="section-header">
          <h2>You Might Also Like</h2>
        </div>
        
        <div class="recommendations-grid">
          <app-movie-card 
            *ngFor="let movie of recommendedMovies" 
            [movie]="movie"
            class="recommendation-item">
          </app-movie-card>
        </div>
      </section>
    </div>

    <ng-template #loading>
      <div class="loading">
        <div class="spinner"></div>
        <p>Loading movie details...</p>
      </div>
    </ng-template>
  `,
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {
  movie: Movie | null = null;
  reviews: Review[] = [];
  recommendedMovies: Movie[] = [];
  showReviewForm: boolean = false;
  isSubmittingReview: boolean = false;

  newReview = {
    userName: '',
    rating: 0,
    comment: ''
  };

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const movieId = +params['id'];
      if (movieId) {
        this.loadMovieDetails(movieId);
        this.loadReviews(movieId);
        this.loadRecommendations(movieId);
      }
    });
  }

  private loadMovieDetails(id: number) {
    this.movieService.getMovieById(id).subscribe({
      next: (movie) => {
        this.movie = movie || null;
      },
      error: (error) => {
        console.error('Error loading movie details:', error);
      }
    });
  }

  private loadReviews(movieId: number) {
    this.movieService.getMovieReviews(movieId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
      }
    });
  }

  private loadRecommendations(movieId: number) {
    this.movieService.getRecommendedMovies(movieId).subscribe({
      next: (movies) => {
        this.recommendedMovies = movies;
      },
      error: (error) => {
        console.error('Error loading recommendations:', error);
      }
    });
  }

  submitReview() {
    if (!this.movie || !this.newReview.userName || !this.newReview.rating || !this.newReview.comment) {
      return;
    }

    this.isSubmittingReview = true;

    const reviewData = {
      movieId: this.movie.id,
      userName: this.newReview.userName,
      rating: this.newReview.rating,
      comment: this.newReview.comment
    };

    this.movieService.addReview(reviewData).subscribe({
      next: (review) => {
        this.reviews.unshift(review);
        this.newReview = { userName: '', rating: 0, comment: '' };
        this.showReviewForm = false;
        this.isSubmittingReview = false;
      },
      error: (error) => {
        console.error('Error submitting review:', error);
        this.isSubmittingReview = false;
      }
    });
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
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