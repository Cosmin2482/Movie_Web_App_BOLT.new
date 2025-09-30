import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <h1 routerLink="/">🎬 CineDB</h1>
        </div>
        
        <nav class="nav-menu">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
          <a routerLink="/movies" routerLinkActive="active">Movies</a>
          <a routerLink="/reviews" routerLinkActive="active">Reviews</a>
        </nav>

        <div class="search-bar">
          <input 
            type="text" 
            placeholder="Search movies..." 
            [(ngModel)]="searchTerm"
            (keyup.enter)="onSearch()"
            class="search-input">
          <button (click)="onSearch()" class="search-btn">
            🔍
          </button>
        </div>

        <div class="mobile-menu-toggle" (click)="toggleMobileMenu()">
          ☰
        </div>
      </div>

      <nav class="mobile-nav" [class.active]="isMobileMenuOpen">
        <a routerLink="/" (click)="closeMobileMenu()">Home</a>
        <a routerLink="/movies" (click)="closeMobileMenu()">Movies</a>
        <a routerLink="/reviews" (click)="closeMobileMenu()">Reviews</a>
      </nav>
    </header>
  `,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  searchTerm: string = '';
  isMobileMenuOpen: boolean = false;

  onSearch() {
    if (this.searchTerm.trim()) {
      console.log('Searching for:', this.searchTerm);
      // Implement search functionality
    }
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }
}