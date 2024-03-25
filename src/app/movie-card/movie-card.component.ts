import { Component } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
// import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent {
  movies: any[] = [];

  constructor(
    private fetchMovies: FetchApiDataService,
    public router: Router,
    // dialog is a feature that is used to open and close a dialog
    public dialog: MatDialog,
    // snackbar is a feature that is used to display a message to the user
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchMovies.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  public getGenre(genre: any) {
    console.log(genre);
    this.dialog.open(GenreComponent, {
      width: '500px',
      height: 'auto',
      data: {
        genre: genre,
      },
    });
  }

  public getDirector(director: any) {
    console.log(director);
    this.dialog.open(DirectorComponent, {
      width: '500px',
      height: 'auto',
      data: {
        director: director,
      },
    });
  }
}
