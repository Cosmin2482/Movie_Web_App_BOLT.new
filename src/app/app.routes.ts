import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'CineDB - Movie Database'
  },
  {
    path: 'movies',
    loadComponent: () => import('./pages/movies/movies.component').then(m => m.MoviesComponent),
    title: 'Movies - CineDB'
  },
  {
    path: 'movies/:id',
    loadComponent: () => import('./pages/movie-detail/movie-detail.component').then(m => m.MovieDetailComponent),
    title: 'Movie Details - CineDB'
  },
  {
    path: 'reviews',
    loadComponent: () => import('./pages/reviews/reviews.component').then(m => m.ReviewsComponent),
    title: 'Reviews - CineDB'
  },
  {
    path: '**',
    redirectTo: ''
  }
];