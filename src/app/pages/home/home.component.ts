import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MovieCardComponent],
  template: `
    <div class="home-container">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">Welcome to CineDB</h1>
          <p class="hero-subtitle">Discover, Review, and Recommend Movies</p>
          <p class="hero-description">
            Your ultimate destination for movie reviews, ratings, and personalized recommendations. 
            Join our community of movie lovers and explore the world of cinema.
          </p>
          <div class="hero-actions">
            <a routerLink="/movies" class="btn btn-primary">Explore Movies</a>
            <a routerLink="/reviews" class="btn btn-secondary">Read Reviews</a>
          </div>
        </div>
        <div class="hero-image">
          <div class="hero-backdrop"></div>
        </div>
      </section>

      <!-- Popular Movies Section -->
      <section class="popular-section">
        <div class="section-header">
          <h2>Popular Movies</h2>
          <p>Most reviewed and highest rated films</p>
        </div>
        
        <div class="movies-grid" *ngIf="popularMovies.length > 0">
          <app-movie-card 
            *ngFor="let movie of popularMovies" 
            [movie]="movie"
            class="movie-card-item">
          </app-movie-card>
        </div>
        
        <div class="loading" *ngIf="isLoading">
          <div class="spinner"></div>
          <p>Loading movies...</p>
        </div>
      </section>

      <!-- Features Section -->
      <section class="features-section">
        <div class="section-header">
          <h2>Why Choose CineDB?</h2>
          <p>Everything you need for your movie journey</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🎬</div>
            <h3>Extensive Database</h3>
            <p>Access thousands of movies with detailed information, cast, and crew details.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">⭐</div>
            <h3>User Reviews</h3>
            <p>Read authentic reviews from our community and share your own movie experiences.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🤖</div>
            <h3>Smart Recommendations</h3>
            <p>Get personalized movie suggestions based on your preferences and viewing history.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📱</div>
            <h3>Responsive Design</h3>
            <p>Enjoy seamless experience across all devices - desktop, tablet, and mobile.</p>
          </div>
        </div>
      </section>
    </div>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  popularMovies: Movie[] = [];
  isLoading: boolean = true;

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.loadPopularMovies();
  }

  private loadPopularMovies() {
    this.movieService.getPopularMovies().subscribe({
      next: (movies) => {
        this.popularMovies = movies;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading popular movies:', error);
        this.isLoading = false;
      }
    });
  }
}