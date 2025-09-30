import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Movie } from '../../models/movie.model';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="movie-card" [routerLink]="['/movies', movie.id]">
      <div class="movie-poster">
        <img [src]="movie.poster" [alt]="movie.title" />
        <div class="movie-overlay">
          <div class="rating-badge">
            <span class="rating-star">⭐</span>
            <span class="rating-value">{{ movie.rating.toFixed(1) }}</span>
          </div>
          <div class="play-button">▶️</div>
        </div>
      </div>
      
      <div class="movie-info">
        <h3 class="movie-title">{{ movie.title }}</h3>
        <div class="movie-meta">
          <span class="movie-year">{{ movie.year }}</span>
          <span class="movie-duration">{{ formatDuration(movie.duration) }}</span>
        </div>
        <div class="movie-genres">
          <span 
            *ngFor="let genre of movie.genre.slice(0, 2)" 
            class="genre-tag">
            {{ genre }}
          </span>
        </div>
        <p class="movie-description">
          {{ truncateText(movie.description, 100) }}
        </p>
        <div class="movie-stats" *ngIf="movie.totalReviews">
          <span class="reviews-count">{{ movie.totalReviews }} reviews</span>
          <span class="average-rating">{{ movie.averageRating?.toFixed(1) || 'N/A' }}/10</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./movie-card.component.css']
})
export class MovieCardComponent {
  @Input() movie!: Movie;

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
}