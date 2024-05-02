import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MovieCardComponent } from '../movie-card/movie-card.component';

@Component({
  selector: 'app-movie-view',
  templateUrl: './movie-view.component.html',
  styleUrl: './movie-view.component.scss',
})
export class MovieViewComponent {
  user: any = { Username: '', Password: '', Email: '', Birthday: '' };
  movies: any[] = [];

  constructor(
    private fetchMovies: FetchApiDataService,
    public router: Router,
    // dialog is a feature that is used to open and close a dialog
    public dialog: MatDialog
  ) {}

  // ngOnInit is a lifecycle hook that is called when the component is initialized
  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchMovies.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      // const userData = JSON.parse(localStorage.getItem('user') || '{}');
      // this. = userData.FavoriteMovies || [];
      // console.log('Favorite Movies get:', this.favoriteMovies);
      return this.movies;
    });
  }

  getMovieCard(movie: any): void {
    this.dialog.open(MovieCardComponent, {
      data: { movie: movie },
    });
  }
}
