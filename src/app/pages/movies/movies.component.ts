import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { Movie, MovieFilter } from '../../models/movie.model';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, FormsModule, MovieCardComponent],
  template: `
    <div class="movies-container">
      <div class="page-header">
        <h1>Discover Movies</h1>
        <p>Explore our extensive collection of movies</p>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="filters-grid">
          <div class="filter-group">
            <label>Search Movies</label>
            <input 
              type="text" 
              [(ngModel)]="filters.searchTerm"
              (input)="applyFilters()"
              placeholder="Search by title, director, or cast..."
              class="search-input">
          </div>
          
          <div class="filter-group">
            <label>Genre</label>
            <select [(ngModel)]="filters.genre" (change)="applyFilters()" class="filter-select">
              <option value="">All Genres</option>
              <option *ngFor="let genre of availableGenres" [value]="genre">{{ genre }}</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Year</label>
            <select [(ngModel)]="filters.year" (change)="applyFilters()" class="filter-select">
              <option value="">All Years</option>
              <option *ngFor="let year of availableYears" [value]="year">{{ year }}</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Minimum Rating</label>
            <select [(ngModel)]="filters.rating" (change)="applyFilters()" class="filter-select">
              <option value="">Any Rating</option>
              <option value="7">7.0+</option>
              <option value="8">8.0+</option>
              <option value="9">9.0+</option>
            </select>
          </div>
        </div>
        
        <button (click)="clearFilters()" class="clear-filters-btn">Clear Filters</button>
      </div>

      <!-- Results -->
      <div class="results-section">
        <div class="results-header">
          <h2>{{ filteredMovies.length }} Movies Found</h2>
          <div class="view-toggle">
            <button 
              (click)="viewMode = 'grid'" 
              [class.active]="viewMode === 'grid'"
              class="view-btn">
              ⊞ Grid
            </button>
            <button 
              (click)="viewMode = 'list'" 
              [class.active]="viewMode === 'list'"
              class="view-btn">
              ☰ List
            </button>
          </div>
        </div>

        <div class="movies-container-inner" [ngClass]="'view-' + viewMode">
          <app-movie-card 
            *ngFor="let movie of filteredMovies; trackBy: trackByMovieId" 
            [movie]="movie"
            class="movie-item">
          </app-movie-card>
        </div>

        <div class="no-results" *ngIf="filteredMovies.length === 0 && !isLoading">
          <div class="no-results-icon">🔍</div>
          <h3>No Movies Found</h3>
          <p>Try adjusting your filters or search terms</p>
        </div>

        <div class="loading" *ngIf="isLoading">
          <div class="spinner"></div>
          <p>Loading movies...</p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
  allMovies: Movie[] = [];
  filteredMovies: Movie[] = [];
  availableGenres: string[] = [];
  availableYears: number[] = [];
  isLoading: boolean = true;
  viewMode: 'grid' | 'list' = 'grid';

  filters: MovieFilter = {
    searchTerm: '',
    genre: '',
    year: undefined,
    rating: undefined
  };

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.loadMovies();
    this.loadGenres();
  }

  private loadMovies() {
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        this.allMovies = movies;
        this.filteredMovies = [...movies];
        this.generateAvailableYears();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading movies:', error);
        this.isLoading = false;
      }
    });
  }

  private loadGenres() {
    this.movieService.getGenres().subscribe({
      next: (genres) => {
        this.availableGenres = genres;
      }
    });
  }

  private generateAvailableYears() {
    const years = [...new Set(this.allMovies.map(movie => movie.year))];
    this.availableYears = years.sort((a, b) => b - a);
  }

  applyFilters() {
    this.isLoading = true;
    
    // Clean up filters
    const cleanFilters: MovieFilter = {
      searchTerm: this.filters.searchTerm?.trim() || undefined,
      genre: this.filters.genre || undefined,
      year: this.filters.year || undefined,
      rating: this.filters.rating || undefined
    };

    this.movieService.getMovies(cleanFilters).subscribe({
      next: (movies) => {
        this.filteredMovies = movies;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error applying filters:', error);
        this.isLoading = false;
      }
    });
  }

  clearFilters() {
    this.filters = {
      searchTerm: '',
      genre: '',
      year: undefined,
      rating: undefined
    };
    this.filteredMovies = [...this.allMovies];
  }

  trackByMovieId(index: number, movie: Movie): number {
    return movie.id;
  }
}