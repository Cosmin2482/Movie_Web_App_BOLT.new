# Movie Database

A modern, responsive movie database application built with Angular 20. Browse popular movies, read reviews, and discover new films to watch.

## Features

- **Movie Browsing**: Explore a curated collection of popular movies with detailed information
- **Advanced Filtering**: Filter movies by genre, year, rating, and search by title, director, or cast
- **Detailed Movie Pages**: View comprehensive information including cast, director, duration, and user ratings
- **User Reviews**: Read and submit reviews for your favorite movies
- **Recommended Movies**: Get personalized movie recommendations based on genre preferences
- **Responsive Design**: Fully responsive interface that works seamlessly on desktop, tablet, and mobile devices

## Technology Stack

- **Framework**: Angular 20 (standalone components)
- **Language**: TypeScript
- **Styling**: CSS with custom design system
- **State Management**: RxJS with BehaviorSubject
- **Routing**: Angular Router

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd angular-starter
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── components/        # Reusable UI components
│   │   ├── header/       # Navigation header
│   │   ├── footer/       # Page footer
│   │   └── movie-card/   # Movie card component
│   ├── pages/            # Page components
│   │   ├── home/         # Homepage with popular movies
│   │   ├── movies/       # Movie listing with filters
│   │   ├── movie-detail/ # Detailed movie information
│   │   └── reviews/      # Movie reviews page
│   ├── services/         # Business logic and data services
│   │   └── movie.service.ts
│   ├── models/           # TypeScript interfaces and types
│   │   └── movie.model.ts
│   └── app.routes.ts     # Application routing configuration
└── global_styles.css     # Global styles and theme
```

## Application Pages

- **Home** (`/`): Featured and popular movies
- **Movies** (`/movies`): Complete movie catalog with filtering options
- **Movie Detail** (`/movie/:id`): Detailed information about a specific movie
- **Reviews** (`/movie/:id/reviews`): User reviews for a specific movie

## Features in Detail

### Movie Filtering
- Filter by genre (Action, Sci-Fi, Drama, Crime, Adventure, Fantasy, Thriller)
- Filter by release year
- Filter by minimum rating
- Search by title, director, or cast member

### Movie Information
Each movie includes:
- Title and poster image
- Release year
- Genre tags
- User rating
- Plot description
- Duration
- Director
- Cast members
- Average rating and total reviews

### Review System
- View all reviews for a movie
- Submit new reviews with ratings (1-10)
- Sort reviews by date
- View helpful vote counts

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
