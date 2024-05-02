import { Component, OnInit, Inject, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MovieDetailsComponent } from '../movie-details/movie-details.component';
import { GenreComponent } from '../genre/genre.component';
import { DirectorComponent } from '../director/director.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent implements OnInit {
  @Input() movie: any;
  @Input() user: any;

  favoriteMovies: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fetchMovies: FetchApiDataService,
    public router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {}

  // ngOnInit is a lifecycle hook that is called when the component is initialized
  ngOnInit(): void {
    this.movie = this.data.movie;
    this.getFavorites();
  }

  getFavorites(): void {
    this.fetchMovies.getFavoriteMovies().subscribe((resp: any) => {
      this.favoriteMovies = resp;
    });
  }

  isFavorite(movieID: string): boolean {
    return this.favoriteMovies.includes(movieID);
  }

  addFavorite(movieID: string): void {
    this.fetchMovies.addFavoriteMovie(movieID).subscribe(() => {
      this.snackBar.open('Movie added to favorites', 'OK', {
        duration: 2000,
      });
      // Update favoriteMovies array after adding a movie to favorites

      this.favoriteMovies.push(movieID);
    });
  }

  deleteFavorite(movieID: string): void {
    this.fetchMovies.deleteFavoriteMovie(movieID).subscribe(() => {
      this.snackBar.open('Movie removed from favorites', 'OK', {
        duration: 2000,
      });
      // Update favoriteMovies array after removing a movie from favorites
      this.favoriteMovies = this.favoriteMovies.filter((id) => id !== movieID);
      this.getFavorites();
      window.location.reload();
    });
  }

  // the use of publice here means that it can be used in the html file
  public getDescription(description: any) {
    this.dialog.open(MovieDetailsComponent, {
      width: '500px',
      height: 'auto',
      data: {
        description: description,
      },
    });
  }

  public getDirector(director: any) {
    this.dialog.open(DirectorComponent, {
      width: '500px',
      height: 'auto',
      data: {
        director: director,
      },
    });
  }

  public getGenre(genre: any) {
    this.dialog.open(GenreComponent, {
      width: '500px',
      height: 'auto',
      data: {
        genre: genre,
      },
    });
  }
}
